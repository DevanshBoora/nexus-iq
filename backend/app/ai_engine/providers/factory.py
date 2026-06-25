from app.ai_engine.providers.base import LLMProvider
from app.ai_engine.providers.gemini import GeminiProvider

def get_llm_provider() -> LLMProvider:
    """
    Factory function to instantiate the active LLM provider.
    In the future, this can read from settings to return OpenAIProvider, etc.
    """
    return GeminiProvider()
