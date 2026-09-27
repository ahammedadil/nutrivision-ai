import re

with open('backend/app.py', 'r') as f:
    code = f.read()

# Replace imports
code = code.replace('from backend.services.inference_service import InferenceService\nfrom backend.services.nutrition_engine import NutritionEngine', 'from backend.services.gemini_service import GeminiService')

# Replace globals
code = code.replace('inference_service = None\nnutrition_engine = None', 'gemini_service = None')
code = code.replace('global inference_service, nutrition_engine', 'global gemini_service')
code = code.replace('''        if inference_service is None:
            inference_service = InferenceService()
        if nutrition_engine is None:
            nutrition_engine = NutritionEngine()''', '''        if gemini_service is None:
            gemini_service = GeminiService()''')

new_predict_logic = """        # Analyze image with Gemini
        detected_foods = gemini_service.analyze_image(filepath)
        
        foods_result = []
        total_nutrition = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sugar": 0}
        
        for food in detected_foods:
            food_data = {
                "name": food.get("name", "Unknown Food"),
                "confidence": 0.99,
                "bbox": {"x1": 0, "y1": 0, "x2": 0, "y2": 0},
                "calories": food.get("calories", 0),
                "protein": food.get("protein", 0),
                "carbs": food.get("carbs", 0),
                "fat": food.get("fat", 0),
                "fiber": food.get("fiber", 0),
                "sugar": food.get("sugar", 0),
                "serving_size": food.get("serving_size", "1 serving")
            }
            foods_result.append(food_data)
            
            # Add to totals
            total_nutrition["calories"] += food_data["calories"]
            total_nutrition["protein"] += food_data["protein"]
            total_nutrition["carbs"] += food_data["carbs"]
            total_nutrition["fat"] += food_data["fat"]
            total_nutrition["fiber"] += food_data["fiber"]
            total_nutrition["sugar"] += food_data["sugar"]"""

code = re.sub(r'# 1\. Run inference.*?total_nutrition = nutrition_engine\.calculate_total_meal\(valid_foods\)', new_predict_logic, code, flags=re.DOTALL)

with open('backend/app.py', 'w') as f:
    f.write(code)
