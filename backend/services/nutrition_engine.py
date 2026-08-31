import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "nutrivision.db")

class NutritionEngine:
    def __init__(self):
        self.db_path = DB_PATH
        
    def get_nutrition_for_food(self, food_name):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM food_nutrition WHERE name = ?", (food_name,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
        
    def calculate_total_meal(self, foods_list):
        total = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "sugar": 0
        }
        
        for food in foods_list:
            for key in total.keys():
                total[key] += food.get(key, 0)
                
        return total
