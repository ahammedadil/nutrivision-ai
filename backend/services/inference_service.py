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
        
        print("Loading universal fallback model for international foods...")
        self.fallback_model = YOLO("yolov8n.pt")
            
    def _parse_results(self, results, allowed_classes=None):
        detected_foods = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                if allowed_classes and cls_id not in allowed_classes:
                    continue
                
                confidence = float(box.conf[0].item())
                name = result.names.get(cls_id, str(cls_id))
                
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                bbox = {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
                
                detected_foods.append({
                    "name": name,
                    "confidence": confidence,
                    "bbox": bbox
                })
        return detected_foods

    def predict(self, image_path):
        results = self.model(image_path, conf=0.25, max_det=5)
        detected_foods = self._parse_results(results)
        
        # If no Indian food detected, try the universal model for Pizza, Hamburger, etc.
        if len(detected_foods) == 0:
            print("No Indian food found. Trying international fallback...")
            fallback_results = self.fallback_model(image_path, conf=0.3, max_det=5)
            # COCO food class IDs: 46 (banana) to 55 (cake), plus we can allow some others
            coco_food_ids = {46, 47, 48, 49, 50, 51, 52, 53, 54, 55}
            detected_foods = self._parse_results(fallback_results, allowed_classes=coco_food_ids)
            
        return detected_foods
