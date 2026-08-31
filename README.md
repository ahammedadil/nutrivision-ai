# nutri
# 🍛 Indian Food Detection Dataset

This dataset contains annotated images for object detection of 20 common Indian dishes. It was prepared to support training machine learning models using the YOLO (You Only Look Once) framework, especially YOLOv8. The annotations follow the YOLO format.

---

## 📁 Dataset Structure



**Dataset YAML Format:**
```yaml
train: images/train     # Training images directory
val: images/valid       # Validation images directory

nc: 20                  # Number of classes

names: [
  "Chicken_Curry", "Plain_Omelette", "Spinach_Paneer", "Appam", "Avial", 
  "Banana_Chips", "Chapati_Roti", "Chocolate_Cake", "Fruit_Salad", "Idli", 
  "Kulfi", "Marble_Cake", "Masala_Dosa", "Masala_Vada", "Mutton_Biryani", 
  "Pancake", "Sambar", "Uttapam", "Lemonade", "Rice_Puttu"
]
