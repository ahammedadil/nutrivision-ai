import os
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_YAML = os.path.join(BASE_DIR, "dataset", "dataset", "data.yaml")
TRAINING_DIR = os.path.join(BASE_DIR, "ai", "training")

def main():
    print(f"Loading YOLOv8n model...")
    model = YOLO("yolov8n.pt")
    
    print(f"Starting FULL training with data: {DATASET_YAML}")
    # Train the model
    results = model.train(
        data=DATASET_YAML,
        epochs=10,          # 10 epochs for medium-high accuracy in ~2 hours
        imgsz=640,
        project=TRAINING_DIR,
        name="nutrivision_indian_production",
        device="cpu",       # Using CPU
        patience=10         # Early stopping if no improvement
    )
    
    print("Training complete!")
    print(f"Best model saved at: {os.path.join(TRAINING_DIR, 'nutrivision_indian_production', 'weights', 'best.pt')}")

if __name__ == "__main__":
    main()
