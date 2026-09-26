import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.services.gemini_service import GeminiService


import sys
import logging




app = Flask(__name__)
CORS(app)

@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        import traceback
        with open('error.log', 'r') as f:
            return f.read()
    except Exception as e:
        return str(e)

@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500


UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize services later to prevent boot timeouts
gemini_service = None

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
        global gemini_service
        if gemini_service is None:
            gemini_service = GeminiService()
    
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected image'}), 400
            
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
                    # Analyze image with Gemini
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
            total_nutrition["sugar"] += food_data["sugar"]
        
        # Cleanup uploaded file
        if os.path.exists(filepath):
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
