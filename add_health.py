import os

with open('backend/app.py', 'r') as f:
    code = f.read()

code = code.replace('CORS(app)', 'CORS(app)\n\n@app.route("/")\ndef healthcheck():\n    return "Nova Backend is Running!"')

with open('backend/app.py', 'w') as f:
    f.write(code)
