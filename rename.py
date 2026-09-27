import os

with open('frontend/index.html', 'r') as f:
    code = f.read()
code = code.replace('<title>NutriVision AI</title>', '<title>Nova</title>')
with open('frontend/index.html', 'w') as f:
    f.write(code)

with open('frontend/src/App.tsx', 'r') as f:
    code = f.read()
code = code.replace('NutriVision <span className="text-slate-400 dark:text-slate-500 font-medium">AI</span>', 'Nova')
with open('frontend/src/App.tsx', 'w') as f:
    f.write(code)

with open('frontend/src/pages/Scanner.tsx', 'r') as f:
    code = f.read()
code = code.replace('Google AI is busy, retrying...', 'Nova is busy, retrying...')
with open('frontend/src/pages/Scanner.tsx', 'w') as f:
    f.write(code)
