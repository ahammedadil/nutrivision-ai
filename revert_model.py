import os

with open('backend/services/gemini_service.py', 'r') as f:
    code = f.read()

code = code.replace("model='gemini-3.8-flash-8b'", "model='gemini-3.8-flash'")

with open('backend/services/gemini_service.py', 'w') as f:
    f.write(code)
