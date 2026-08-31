import os
import subprocess
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRAIN_SCRIPT = os.path.join(BASE_DIR, "ai", "scripts", "train.py")
INFERENCE_SERVICE = os.path.join(BASE_DIR, "backend", "services", "inference_service.py")

def main():
    print("=== Starting 10-Epoch Production Training ===")
    print("This will take about 2 hours on a CPU. Please leave this terminal open.")
    
    import sys
    # 1. Run the training script
    process = subprocess.Popen([sys.executable, TRAIN_SCRIPT])
    process.wait()
    
    if process.returncode == 0:
        print("\n=== Training Completed Successfully! ===")
        print("Now updating backend inference service to use the new production model...")
        
        # 2. Update the Inference Service
        with open(INFERENCE_SERVICE, "r") as f:
            content = f.read()
            
        # Update path
        content = content.replace("nutrivision_indian", "nutrivision_indian_production")
        # Restore confidence threshold
        content = content.replace("conf=0.02", "conf=0.25")
        
        with open(INFERENCE_SERVICE, "w") as f:
            f.write(content)
            
        print("Backend updated! Flask will automatically restart.")
        print("The AI is now running with High Accuracy!")
    else:
        print("\n=== Training Failed ===")

if __name__ == "__main__":
    main()
