import json
import httpx
from typing import Type, Any
from pydantic import BaseModel

from app.core.config import settings
from app.ai_engine.providers.base import LLMProvider

class GeminiProvider(LLMProvider):
    """
    Implementation of the LLMProvider using the Gemini REST API.
    We use the REST API via httpx to ensure we have access to the latest
    structured output (responseSchema) features regardless of Python library version limits.
    """
    
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent"

    async def generate_structured(
        self, 
        prompt: str, 
        response_schema: Type[BaseModel], 
        temperature: float = 0.2
    ) -> BaseModel:
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")

        # Convert Pydantic schema to standard JSON Schema representation for Gemini
        schema_json = response_schema.model_json_schema()
        
        # We need to map standard JSON schema types to Gemini's expected Type enum
        # Note: A robust implementation would walk the schema and translate types recursively.
        # For simplicity in this subsystem, we assume Gemini accepts standard JSON Schema 
        # in the 'responseSchema' field (as supported by Gemini 1.5).
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": temperature,
                "responseMimeType": "application/json",
                # Pass the pydantic json schema. Gemini 1.5 supports this structure.
                "responseSchema": self._pydantic_to_gemini_schema(schema_json)
            }
        }
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            
            response.raise_for_status()
            data = response.json()
            
            try:
                # Extract the text content from the response
                text_response = data["candidates"][0]["content"]["parts"][0]["text"]
                # Parse it into our Pydantic model
                return response_schema.model_validate_json(text_response)
            except (KeyError, IndexError, json.JSONDecodeError) as e:
                raise RuntimeError(f"Failed to parse Gemini response: {data}") from e

    def _pydantic_to_gemini_schema(self, pydantic_schema: dict) -> dict:
        """
        Translates a Pydantic JSON schema to the format expected by Gemini REST API.
        """
        type_mapping = {
            "string": "STRING",
            "number": "NUMBER",
            "integer": "INTEGER",
            "boolean": "BOOLEAN",
            "array": "ARRAY",
            "object": "OBJECT"
        }
        
        def traverse(node: dict) -> dict:
            gemini_node = {}
            if "type" in node:
                gemini_node["type"] = type_mapping.get(node["type"], "STRING")
            if "description" in node:
                gemini_node["description"] = node["description"]
            if "enum" in node:
                gemini_node["enum"] = node["enum"]
            if "items" in node:
                gemini_node["items"] = traverse(node["items"])
            if "properties" in node:
                gemini_node["properties"] = {k: traverse(v) for k, v in node["properties"].items()}
            if "required" in node:
                gemini_node["required"] = node["required"]
            return gemini_node

        return traverse(pydantic_schema)
