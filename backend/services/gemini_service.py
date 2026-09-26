import os
from google import genai
from google.genai import types
import json
import base64
from pydantic import BaseModel, Field

class Nutrition(BaseModel):
    name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    fiber: int
    sugar: int
    serving_size: str

class FoodResponse(BaseModel):
    foods: list[Nutrition]

class GeminiService:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set!")
        
        self.client = genai.Client(api_key=api_key)
        
    def _encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def analyze_image(self, image_path):
        base64_image = self._encode_image(image_path)
        
        prompt = """
        You are an expert nutritionist and food AI.
        Look at this image and identify all the distinct food items present.
        For each food item, estimate the nutritional values for a standard serving size.
        """
        
        import time
        for attempt in range(10):
            try:
                response = self.client.models.generate_content(
                    model='gemini-3.8-flash',
                    contents=[
                        prompt,
                        types.Part.from_bytes(
                            data=open(image_path, "rb").read(),
                            mime_type='image/jpeg',
                        )
                    ],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=FoodResponse,
                        temperature=0.1,
                    ),
                )
                
                parsed_json = json.loads(response.text)
                return parsed_json.get("foods", [])
            except Exception as e:
                if '503' in str(e) and attempt < 9:
                    time.sleep(2)
                    continue
                print("Failed to parse Gemini response:", e)
                raise e
