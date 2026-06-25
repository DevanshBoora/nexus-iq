import os
from typing import Dict, Any

class PromptManager:
    """
    Manages loading and rendering of versioned prompt templates.
    Ensures separation of prompt engineering from business logic.
    """
    
    def __init__(self, templates_dir: str = None):
        if not templates_dir:
            # Default to the templates directory relative to this file
            base_dir = os.path.dirname(os.path.abspath(__line__ if False else __file__))
            self.templates_dir = os.path.join(base_dir, "templates")
        else:
            self.templates_dir = templates_dir
            
    def load_template(self, template_name: str) -> str:
        """Loads a raw markdown template from disk."""
        filepath = os.path.join(self.templates_dir, f"{template_name}.md")
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Prompt template not found: {filepath}")
            
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
            
    def render(self, template_name: str, context: Dict[str, Any]) -> str:
        """
        Renders a template by injecting the context variables.
        Uses basic string formatting. For complex logic, Jinja2 could be used.
        """
        template = self.load_template(template_name)
        try:
            return template.format(**context)
        except KeyError as e:
            raise ValueError(f"Missing required context variable {e} for template {template_name}")
