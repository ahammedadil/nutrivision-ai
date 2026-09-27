import os

with open('frontend/src/pages/Scanner.tsx', 'r') as f:
    code = f.read()

target_bar = """                  <div className="mt-8 w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </div>"""

infinite_bar = """                  <div className="mt-8 w-64 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                    <motion.div 
                      className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-full"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{ width: "100%" }}
                    />
                  </div>"""

if target_bar in code:
    code = code.replace(target_bar, infinite_bar)
else:
    print('Target bar not found.')

with open('frontend/src/pages/Scanner.tsx', 'w') as f:
    f.write(code)
