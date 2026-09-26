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
        Look at this image and carefully identify every single food item present.
        
        CRITICAL INSTRUCTIONS FOR ACCURACY:
        1. COUNT THE EXACT QUANTITY: If there are multiple pieces of the same food (e.g., 2 Samosas, 3 Idlis, 4 slices of pizza), you MUST count them.
        2. MULTIPLY THE NUTRITION: If you see 3 Idlis, you must calculate the macros for ONE Idli, and then MULTIPLY everything (calories, protein, carbs, fat, fiber, sugar) by 3. 
        3. NAMING: Name the food with the quantity included (e.g., "Idli (3 pieces)", "Samosa (2 pieces)").
        4. SERVING SIZE: Set the serving_size field to the exact quantity you counted (e.g., "3 pieces", "1 full bowl", "2 slices").
        
        Be as highly accurate as possible with the nutritional estimation based on the visual size and quantity of the food in the image.
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
