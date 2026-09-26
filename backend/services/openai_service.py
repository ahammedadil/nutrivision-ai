import os
from openai import OpenAI
import json
import base64

class OpenAIService:
    def __init__(self):
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set!")
        self.client = OpenAI(api_key=api_key)
        
    def _encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def analyze_image(self, image_path):
        base64_image = self._encode_image(image_path)
        
        prompt = """
        You are an expert nutritionist and food AI.
        Look at this image and identify all the distinct food items present.
        For each food item, estimate the nutritional values for a standard serving size.
        Return the result strictly as a JSON object matching this schema:
        {
          "foods": [
            {
              "name": "string",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "fiber": number,
              "sugar": number,
              "serving_size": "string"
            }
          ]
        }
        Do not return anything else except the raw JSON.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                response_format={ "type": "json_object" },
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1000,
            )
            
            result_text = response.choices[0].message.content
            parsed_json = json.loads(result_text)
            return parsed_json.get("foods", [])
        except Exception as e:
            print("Failed to parse OpenAI response:", e)
            return []
