import os

with open('frontend/src/pages/Dashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace("import { Flame, Activity, Plus, Camera, History } from 'lucide-react';", "import { Flame, Activity, Plus, Camera, History, X } from 'lucide-react';")

with open('frontend/src/pages/Dashboard.tsx', 'w') as f:
    f.write(code)
