import os
import google.generativeai as genai
import json
import typing_extensions as typing

class Nutrition(typing.TypedDict):
    name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    fiber: int
    sugar: int
    serving_size: str

class FoodResponse(typing.TypedDict):
    foods: list[Nutrition]

class GeminiService:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set!")
        
        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash for fast vision processing
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    def analyze_image(self, image_path):
        # Upload the file to Gemini (or pass it directly)
        myfile = genai.upload_file(image_path)
        
        prompt = """
        You are an expert nutritionist and food AI.
        Look at this image and identify all the distinct food items present.
        For each food item, estimate the nutritional values for a standard serving size.
        Return the result strictly as a JSON object matching the requested schema.
        """
        
        result = self.model.generate_content(
            [myfile, prompt],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=FoodResponse,
                temperature=0.1,
            ),
        )
        
        # Clean up the uploaded file to save space on Google's servers
        try:
            genai.delete_file(myfile.name)
        except:
            pass
            
        try:
            parsed_json = json.loads(result.text)
            return parsed_json.get("foods", [])
        except Exception as e:
            print("Failed to parse Gemini response:", e)
            return []
