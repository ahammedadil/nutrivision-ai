import os
import cv2
import numpy as np
import random

CLASSES = {0: "Pizza", 1: "Coke", 2: "French Fries"}
NUM_TRAIN = 50
NUM_VAL = 10
IMG_SIZE = 640

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

def create_dirs():
    dirs = [
        "images/train",
        "images/val",
        "labels/train",
        "labels/val"
    ]
    for d in dirs:
        os.makedirs(os.path.join(DATASET_DIR, d), exist_ok=True)

def generate_image_and_label(split, index):
    img = np.zeros((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
    
    # Background color (random darkish)
    img[:] = (random.randint(20, 50), random.randint(20, 50), random.randint(20, 50))
    
    num_objects = random.randint(1, 3)
    labels = []
    
    for _ in range(num_objects):
        cls_id = random.choice(list(CLASSES.keys()))
        
        # Random size and position
        w = random.randint(100, 300)
        h = random.randint(100, 300)
        x_min = random.randint(0, IMG_SIZE - w)
        y_min = random.randint(0, IMG_SIZE - h)
        x_max = x_min + w
        y_max = y_min + h
        
        # Draw something based on class
        if cls_id == 0: # Pizza (yellowish circle)
            center = (x_min + w//2, y_min + h//2)
            cv2.circle(img, center, min(w, h)//2, (0, 200, 255), -1)
        elif cls_id == 1: # Coke (red rectangle)
            cv2.rectangle(img, (x_min, y_min), (x_max, y_max), (0, 0, 255), -1)
        elif cls_id == 2: # French Fries (multiple yellow lines)
            for _ in range(5):
                fx = random.randint(x_min, x_max)
                cv2.line(img, (fx, y_min), (fx, y_max), (0, 255, 255), 10)
        
        # Add label text for debugging, though YOLO doesn't need it on the image itself
        cv2.putText(img, CLASSES[cls_id], (x_min, y_min + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # YOLO format: class x_center y_center width height (normalized 0-1)
        x_c = (x_min + w/2) / IMG_SIZE
        y_c = (y_min + h/2) / IMG_SIZE
        w_n = w / IMG_SIZE
        h_n = h / IMG_SIZE
        
        labels.append(f"{cls_id} {x_c:.6f} {y_c:.6f} {w_n:.6f} {h_n:.6f}")
        
    # Save image
    img_name = f"{split}_{index}.jpg"
    img_path = os.path.join(DATASET_DIR, f"images/{split}", img_name)
    cv2.imwrite(img_path, img)
    
    # Save label
    label_name = f"{split}_{index}.txt"
    label_path = os.path.join(DATASET_DIR, f"labels/{split}", label_name)
    with open(label_path, "w") as f:
        f.write("\n".join(labels))

def generate_yaml():
    yaml_content = f"""path: {DATASET_DIR.replace(chr(92), '/')}
train: images/train
val: images/val

names:
  0: Pizza
  1: Coke
  2: French Fries
"""
    with open(os.path.join(DATASET_DIR, "data.yaml"), "w") as f:
        f.write(yaml_content)

if __name__ == "__main__":
    create_dirs()
    print("Generating training data...")
    for i in range(NUM_TRAIN):
        generate_image_and_label("train", i)
        
    print("Generating validation data...")
    for i in range(NUM_VAL):
        generate_image_and_label("val", i)
        
    generate_yaml()
    print("Dataset generation complete. data.yaml created.")
