from mlcore import ClinicalAssistant
from models import RecommendationPayload
import re

class GetRecommendationController:
    def __init__(self, payload: RecommendationPayload):
        self.payload = payload

    def _parse_markdown_table(self, text: str):
        """
        Convert a markdown table into a list of dictionaries.
        If parsing fails, return [].
        """
        lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
        if len(lines) < 2:
            return []

        headers = [h.strip() for h in lines[0].split("|")[1:-1]]
        rows = []
        for line in lines[2:]:  # skip header + separator
            cols = [c.strip() for c in line.split("|")[1:-1]]
            if len(cols) == len(headers):
                rows.append(dict(zip(headers, cols)))
        return rows

    def _parse_category_table(self, text: str):
        """
        Parse the Category/Recommendation table format and extract content for each category.
        """
        # Find the table section
        table_match = re.search(r'\| Category \| Recommendation \|(.*?)(?=\n\n|\n\*\*|$)', text, re.S)
        if not table_match:
            return {"suggested_actions": [], "monitoring_requirements": [], "red_flags": []}
            
        table_content = table_match.group(1)
        lines = [line.strip() for line in table_content.split('\n') if line.strip() and not line.strip().startswith('|---')]
        
        result = {"suggested_actions": [], "monitoring_requirements": [], "red_flags": []}
        
        for line in lines:
            if '|' in line:
                parts = [part.strip() for part in line.split('|') if part.strip()]
                if len(parts) >= 2:
                    category = parts[0].replace('**', '').strip().lower()
                    content = parts[1].replace('**', '').strip()
                    
                    # Split content by bullet points and clean up
                    items = []
                    if '•' in content:
                        bullet_items = content.split('•')
                        for item in bullet_items[1:]:  # Skip first empty item
                            clean_item = item.strip()
                            if clean_item:
                                # Remove HTML tags like <br>
                                clean_item = re.sub(r'<[^>]+>', ' ', clean_item)
                                # Clean up extra whitespace
                                clean_item = ' '.join(clean_item.split())
                                items.append(clean_item)
                    else:
                        # If no bullet points, treat the whole content as one item
                        clean_content = re.sub(r'<[^>]+>', ' ', content)
                        clean_content = ' '.join(clean_content.split())
                        if clean_content:
                            items.append(clean_content)
                    
                    # Map to appropriate category
                    if 'suggested actions' in category:
                        result["suggested_actions"] = items
                    elif 'monitoring requirements' in category:
                        result["monitoring_requirements"] = items
                    elif 'red flags' in category:
                        result["red_flags"] = items
        
        return result

    def execute(self):
        clinical_assistant = ClinicalAssistant()
        user_input = f"""
        Model prediction: {self.payload.model_prediction}
        Patient vitals: {self.payload.patient_vitals}
        """
        response = clinical_assistant.chat(user_input)

        # Defaults – always present
        result = {
            "suggested_actions": [],
            "monitoring_requirements": [],
            "red_flags": []
        }

        # Parse the category table format
        parsed_data = self._parse_category_table(response)
        result.update(parsed_data)

        return result
