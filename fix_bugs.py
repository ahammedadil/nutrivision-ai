import re

with open('backend/app.py', 'r') as f:
    code = f.read()

# Fix the return indentation
broken_return = """            # Cleanup uploaded file
            os.remove(filepath)
            
            return jsonify({
                "foods": foods_result,
                "total": total_nutrition
        })"""

code = code.replace(broken_return, "")

fixed_return = """            total_nutrition["sugar"] += food_data["sugar"]
        
        # Cleanup uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({
            "foods": foods_result,
            "total": total_nutrition
        })"""

code = code.replace('            total_nutrition["sugar"] += food_data["sugar"]', fixed_return)

with open('backend/app.py', 'w') as f:
    f.write(code)

with open('backend/services/openai_service.py', 'r') as f:
    ocode = f.read()

ocode = ocode.replace('except Exception as e:\n            print("Failed to parse OpenAI response:", e)\n            return []', 'except Exception as e:\n            raise e')

with open('backend/services/openai_service.py', 'w') as f:
    f.write(ocode)
