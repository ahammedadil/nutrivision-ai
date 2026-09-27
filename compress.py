import os

with open('backend/services/gemini_service.py', 'r') as f:
    code = f.read()

import_line = 'import base64'
import_replacement = 'import base64\nfrom io import BytesIO\nfrom PIL import Image'

if 'from PIL import Image' not in code:
    code = code.replace(import_line, import_replacement)

read_target = 'data=open(image_path, "rb").read(),'
compress_logic = 'data=self._compress_image(image_path),'

if read_target in code:
    code = code.replace(read_target, compress_logic)

class_target = 'class GeminiService:'
class_replacement = '''class GeminiService:
    def _compress_image(self, path):
        with Image.open(path) as img:
            img = img.convert('RGB')
            # Reduce resolution to max 800x800 and compress aggressively
            img.thumbnail((800, 800))
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=70)
            return buffer.getvalue()
'''

if 'def _compress_image' not in code:
    code = code.replace(class_target, class_replacement)

with open('backend/services/gemini_service.py', 'w') as f:
    f.write(code)
