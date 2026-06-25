from abc import ABC, abstractmethod
from typing import Any, Dict, Type

from pydantic import BaseModel

class LLMProvider(ABC):
    """
    Abstract Base Class for LLM Providers.
    Ensures that any model we use (Gemini, OpenAI, Anthropic)
    adheres to the exact same interface for the orchestrator.
    """
    
    @abstractmethod
    async def generate_structured(
        self, 
        prompt: str, 
        response_schema: Type[BaseModel], 
        temperature: float = 0.2
    ) -> BaseModel:
        """
        Generates a response from the LLM constrained to a specific Pydantic schema.
        
        Args:
            prompt: The full rendered prompt string.
            response_schema: A Pydantic BaseModel class defining the expected output structure.
            temperature: The sampling temperature. Lower is more deterministic.
            
        Returns:
            An instance of the provided response_schema.
        """
        pass
