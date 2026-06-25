import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai_engine.core.context_builder import ContextBuilder
from app.ai_engine.prompts.manager import PromptManager
from app.ai_engine.providers.factory import get_llm_provider
from app.ai_engine.schemas.outputs import EngineeringInsight
from app.ai_engine.cache.manager import AICacheManager

logger = logging.getLogger("nexus-iq")

class AIOrchestrator:
    """
    The main entry point for the AI Subsystem.
    Coordinates context building, prompt rendering, and LLM provider invocation.
    """
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.context_builder = ContextBuilder(session)
        self.prompt_manager = PromptManager()
        self.provider = get_llm_provider()
        self.cache_manager = AICacheManager(session)
        
    async def analyze_event(self, event_id: str) -> EngineeringInsight:
        """
        Analyzes a single webhook event and returns a structured insight.
        """
        logger.info(f"AI Orchestrator: Analyzing event {event_id}")
        
        # 1. Build Context
        context = await self.context_builder.build_event_context(event_id)
        
        # 2. Render Prompt
        prompt = self.prompt_manager.render("analyze_event_v1", context)
        
        # 3. Cache Check
        cached_response = await self.cache_manager.get_cached_response(prompt)
        if cached_response:
            logger.info(f"AI Orchestrator: Cache hit for event {event_id}")
            return EngineeringInsight.model_validate(cached_response)
        
        # 4. Invoke LLM
        insight = await self.provider.generate_structured(
            prompt=prompt,
            response_schema=EngineeringInsight,
            temperature=0.2
        )
        
        # 5. Evaluate Confidence (Business rule filter)
        if insight.confidence_score < 0.4:
            logger.warning(f"Low confidence AI insight generated: {insight.confidence_score}. Might discard.")
            
        # 6. Save to Cache
        await self.cache_manager.set_cached_response(prompt, insight.model_dump())
            
        logger.info(f"AI Orchestrator: Generated insight '{insight.title}' with {insight.confidence_score} confidence.")
        return insight
