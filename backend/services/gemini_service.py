import os
from google import genai
from google.genai import types
import json
import base64
from io import BytesIO
from PIL import Image
from pydantic import BaseModel, Field

CURRENT_KEY_INDEX = 0

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
    def _compress_image(self, path):
        with Image.open(path) as img:
            img = img.convert('RGB')
            # Reduce resolution to max 800x800 and compress aggressively
            img.thumbnail((800, 800))
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=70)
            return buffer.getvalue()

    def __init__(self):
        pass
        
    def _get_client(self):
        global CURRENT_KEY_INDEX
        keys_str = os.environ.get("GEMINI_API_KEY", "")
        keys = [k.strip() for k in keys_str.split(",") if k.strip()]
        if not keys:
            raise ValueError("GEMINI_API_KEY environment variable is not set!")
        
        CURRENT_KEY_INDEX = CURRENT_KEY_INDEX % len(keys)
        return genai.Client(api_key=keys[CURRENT_KEY_INDEX]), keys
        
    def _encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def analyze_image(self, image_path):
        global CURRENT_KEY_INDEX
        
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
        # Try up to 5 times to handle key rotation and 503s
        for attempt in range(5):
            client, keys = self._get_client()
            try:
                response = client.models.generate_content(
                    model='gemini-3.8-flash',
                    contents=[
                        prompt,
                        types.Part.from_bytes(
                            data=self._compress_image(image_path),
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
                error_str = str(e)
                
                # If we get a 429 Rate Limit (Quota Exhausted), rotate to the next API key!
                if '429' in error_str and attempt < 4:
                    print(f"Key {CURRENT_KEY_INDEX + 1} exhausted. Rotating to next key...")
                    CURRENT_KEY_INDEX = (CURRENT_KEY_INDEX + 1) % len(keys)
                    time.sleep(1)
                    continue
                    
                # If Google is overloaded, just wait and try again
                elif '503' in error_str and attempt < 4:
                    time.sleep(5)
                    continue
                    
                print("Failed to parse Gemini response:", e)
                raise e
