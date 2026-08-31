import os
import glob
import re
import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset", "dataset")
LABELS_DIR = os.path.join(DATASET_DIR, "labels", "train")
YAML_PATH = os.path.join(DATASET_DIR, "data.yaml")

def generate_yaml():
    class_map = {}
    
    # Iterate over label files to find class IDs and infer names from filenames
    label_files = glob.glob(os.path.join(LABELS_DIR, "*.txt"))
    for file_path in label_files:
        filename = os.path.basename(file_path)
        
        # Filename format: {class_id}_{class_name}.txt or {class_id}_{class_name}_{num}.txt
        # E.g., 43_Mutton_Biryani.txt or 5_Masala_Dosa_new.txt
        match = re.match(r"^(\d+)_([A-Za-z0-9\(\)_\[\]]+?)(?:_new|_\d+)?\.txt$", filename)
        
        if match:
            # We don't actually need to parse the filename if we can just read the first line of the file!
            # Let's read the first line of the file to get the exact class ID, because filenames might be inconsistent.
            with open(file_path, "r") as f:
                first_line = f.readline().strip()
                if first_line:
                    class_id_str = first_line.split(" ")[0]
                    try:
                        class_id = int(class_id_str)
                        
                        # Now infer the name from the filename
                        # Strip numbers and .txt, then clean up
                        name = re.sub(r"^\d+_", "", filename)
                        name = re.sub(r"(_new|_\d+)?\.txt$", "", name)
                        name = name.replace("__", "_").replace("_", " ").strip()
                        
                        if class_id not in class_map:
                            class_map[class_id] = name
                    except ValueError:
                        pass
    
    print(f"Found {len(class_map)} classes:")
    for cid in sorted(class_map.keys()):
        print(f"  {cid}: {class_map[cid]}")
        
    # Generate YAML
    yaml_data = {
        "path": DATASET_DIR.replace("\\", "/"),
        "train": "images/train",
        "val": "images/valid",
        "names": {cid: class_map[cid] for cid in sorted(class_map.keys())}
    }
    
    with open(YAML_PATH, "w") as f:
        yaml.dump(yaml_data, f, default_flow_style=False, sort_keys=False)
        
    print(f"\nGenerated {YAML_PATH}")

if __name__ == "__main__":
    generate_yaml()
