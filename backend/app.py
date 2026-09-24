import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.services.inference_service import InferenceService
from backend.services.nutrition_engine import NutritionEngine

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize services later to prevent boot timeouts
inference_service = None
nutrition_engine = None

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'online',
        'message': 'NutriVision AI Backend is running perfectly!',
        'version': '2.0 (Premium Phase)'
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        global inference_service, nutrition_engine
        if inference_service is None:
            inference_service = InferenceService()
        if nutrition_engine is None:
            nutrition_engine = NutritionEngine()
    
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected image'}), 400
            
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # 1. Run inference
            detected_items = inference_service.predict(filepath)
            
            # 2. Get nutrition info
            foods_result = []
            for item in detected_items:
                name = item['name']
                
                # Simple fuzzy match for "Pizza" / "pizza" (our mock model output capitalized)
                # YOLO might output lowercase depending on names config
                nutrition = nutrition_engine.get_nutrition_for_food(name.capitalize())
                
                if not nutrition:
                    # If not found, check if it's lower case match
                    nutrition = nutrition_engine.get_nutrition_for_food(name)
                    
                if nutrition:
                    food_data = {
                        "name": nutrition['name'],
                        "confidence": item['confidence'],
                        "bbox": item['bbox'],
                        "calories": nutrition['calories'],
                        "protein": nutrition['protein'],
                        "carbs": nutrition['carbs'],
                        "fat": nutrition['fat'],
                        "fiber": nutrition['fiber'],
                        "sugar": nutrition['sugar'],
                        "serving_size": nutrition['serving_size']
                    }
                    foods_result.append(food_data)
                else:
                    # Food detected but no nutrition data
                    foods_result.append({
                        "name": name,
                        "confidence": item['confidence'],
                        "bbox": item['bbox'],
                        "error": "Nutrition data not found"
                    })
                    
            # 3. Calculate total meal nutrition
            valid_foods = [f for f in foods_result if "error" not in f]
            total_nutrition = nutrition_engine.calculate_total_meal(valid_foods)
            
            # Cleanup uploaded file
            os.remove(filepath)
            
            return jsonify({
                "foods": foods_result,
                "total": total_nutrition
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
