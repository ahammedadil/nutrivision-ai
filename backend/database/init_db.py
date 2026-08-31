import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "nutrivision.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Drop table if exists to update schema
    cursor.execute('DROP TABLE IF EXISTS food_nutrition')
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS food_nutrition (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        fiber REAL,
        sugar REAL,
        serving_size TEXT NOT NULL
    )
    ''')

    # IFCT 2017 inspired macros for the 20 dataset classes
    food_data = [
        ("Chicken Curry", 240, 18.5, 8.0, 15.0, 1.2, 2.0, "1 cup (250g)"),
        ("Plain omelette omlet", 154, 11.0, 1.0, 11.0, 0.0, 1.0, "2 eggs (100g)"),
        ("Spinach paneer Palak paneer", 280, 12.0, 10.0, 22.0, 4.0, 3.0, "1 cup (250g)"),
        ("Appam", 120, 2.0, 25.0, 1.0, 1.5, 2.0, "2 pieces (100g)"),
        ("Avial", 160, 4.0, 15.0, 10.0, 5.0, 3.0, "1 cup (200g)"),
        ("Banana chips", 520, 2.0, 60.0, 33.0, 4.0, 10.0, "100g"),
        ("Chapati Roti", 104, 3.0, 22.0, 0.5, 3.0, 0.0, "1 piece (40g)"),
        ("Chocolate cake", 370, 4.0, 50.0, 18.0, 2.0, 35.0, "1 slice (100g)"),
        ("Fruit salad", 60, 1.0, 15.0, 0.2, 2.0, 12.0, "1 cup (150g)"),
        ("Idli", 58, 2.0, 12.0, 0.2, 1.0, 0.0, "1 piece (40g)"),
        ("Kulfi", 200, 4.0, 22.0, 11.0, 0.0, 18.0, "1 stick (100g)"),
        ("Marble cake", 350, 4.5, 48.0, 16.0, 1.5, 30.0, "1 slice (100g)"),
        ("Masala Dosa", 210, 4.0, 35.0, 5.0, 3.0, 2.0, "1 piece (150g)"),
        ("Masala Vada", 180, 5.0, 18.0, 10.0, 4.0, 1.0, "2 pieces (60g)"),
        ("Mutton Biryani", 350, 15.0, 45.0, 12.0, 2.0, 2.0, "1 cup (250g)"),
        ("Pancake", 227, 6.0, 28.0, 10.0, 1.0, 5.0, "2 pieces (100g)"),
        ("Uttapam", 180, 4.0, 30.0, 4.0, 3.0, 2.0, "1 piece (120g)"),
        ("Lemonade", 40, 0.0, 10.0, 0.0, 0.0, 9.0, "1 glass (250ml)"),
        ("Rice puttu Ari puttu", 150, 3.0, 32.0, 1.5, 2.0, 1.0, "1 cup (100g)"),
        ("Sambar", 130, 5.0, 20.0, 4.0, 5.0, 4.0, "1 cup (200g)")
    ]

    # Clear existing data and insert new Indian food data
    cursor.execute("DELETE FROM food_nutrition")
    
    cursor.executemany('''
    INSERT INTO food_nutrition (name, calories, protein, carbs, fat, fiber, sugar, serving_size)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', food_data)

    conn.commit()
    conn.close()
    print("Indian Food database initialized successfully with IFCT 2017 inspired data!")

if __name__ == "__main__":
    init_db()
