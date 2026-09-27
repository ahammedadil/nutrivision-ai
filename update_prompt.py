import os

with open('backend/services/gemini_service.py', 'r') as f:
    code = f.read()

old_prompt = """        prompt = \"\"\"
        You are an expert nutritionist and food AI.
        Look at this image and identify all the distinct food items present.
        For each food item, estimate the nutritional values for a standard serving size.
        \"\"\""""

new_prompt = """        prompt = \"\"\"
        You are an expert nutritionist and food AI.
        Look at this image and carefully identify every single food item present.
        
        CRITICAL INSTRUCTIONS FOR ACCURACY:
        1. COUNT THE EXACT QUANTITY: If there are multiple pieces of the same food (e.g., 2 Samosas, 3 Idlis, 4 slices of pizza), you MUST count them.
        2. MULTIPLY THE NUTRITION: If you see 3 Idlis, you must calculate the macros for ONE Idli, and then MULTIPLY everything (calories, protein, carbs, fat, fiber, sugar) by 3. 
        3. NAMING: Name the food with the quantity included (e.g., "Idli (3 pieces)", "Samosa (2 pieces)").
        4. SERVING SIZE: Set the serving_size field to the exact quantity you counted (e.g., "3 pieces", "1 full bowl", "2 slices").
        
        Be as highly accurate as possible with the nutritional estimation based on the visual size and quantity of the food in the image.
        \"\"\""""

code = code.replace(old_prompt, new_prompt)

with open('backend/services/gemini_service.py', 'w') as f:
    f.write(code)
