import os
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ai", "training", "nutrivision_indian_production-2", "weights", "best.pt")

class InferenceService:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            print(f"Loading custom model from {MODEL_PATH}")
            self.model = YOLO(MODEL_PATH)
        else:
            print("Custom model not found, falling back to yolov8n.pt")
            self.model = YOLO("yolov8n.pt")
            
    def predict(self, image_path):
        # Using a very low confidence threshold (0.02) because the model was only trained for 1 epoch for the fast demo
        # In production with a fully trained model (50+ epochs), this would be 0.25
        results = self.model(image_path, conf=0.25, max_det=5)
        
        detected_foods = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())
                
                # Use names from the model if available, otherwise just ID
                name = result.names.get(cls_id, str(cls_id))
                
                # Format bounding box (x, y, w, h)
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                bbox = {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2
                }
                
                detected_foods.append({
                    "name": name,
                    "confidence": confidence,
                    "bbox": bbox
                })
                
        return detected_foods
