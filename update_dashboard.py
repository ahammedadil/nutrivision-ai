import os

with open('frontend/src/pages/Dashboard.tsx', 'r') as f:
    code = f.read()

# Add useState import if missing, but let's just do it directly.
if 'import { useState } from "react";' not in code and "import { useState } from 'react';" not in code:
    code = "import { useState } from 'react';\n" + code

# Add X to lucide-react imports
if 'X' not in code.split('lucide-react')[0]:
    code = code.replace('import { Camera, Activity, Flame, History, Plus }', 'import { Camera, Activity, Flame, History, Plus, X }')

# Add state and submit handler
dashboard_func = "export default function Dashboard() {"
modal_state = """export default function Dashboard() {
  const [showLogModal, setShowLogModal] = useState(false);
  const [manualMeal, setManualMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
"""
code = code.replace(dashboard_func, modal_state)

# Replace addMeal extraction from store
store_target = "const { name, streak, dailyGoal, dailyConsumed, recentMeals } = useStore();"
store_replace = """const { name, streak, dailyGoal, dailyConsumed, recentMeals, addMeal } = useStore();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMeal.name || !manualMeal.calories) return;
    
    addMeal({
      id: Date.now().toString(),
      name: manualMeal.name,
      calories: parseInt(manualMeal.calories) || 0,
      protein: parseInt(manualMeal.protein) || 0,
      carbs: parseInt(manualMeal.carbs) || 0,
      fat: parseInt(manualMeal.fat) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    setShowLogModal(false);
    setManualMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };"""
code = code.replace(store_target, store_replace)

# Update the button
btn_target = """<button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Log Manually
          </button>"""
btn_replace = """<button onClick={() => setShowLogModal(true)} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Log Manually
          </button>"""
code = code.replace(btn_target, btn_replace)

# Add the modal JSX at the very end of the main div
modal_jsx = """
      {/* Manual Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLogModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Log Meal Manually</h2>
              
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Food Name *</label>
                  <input required type="text" value={manualMeal.name} onChange={e => setManualMeal({...manualMeal, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g., Chicken Salad" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Calories *</label>
                    <input required type="number" min="0" value={manualMeal.calories} onChange={e => setManualMeal({...manualMeal, calories: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="kcal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Protein (g)</label>
                    <input type="number" min="0" value={manualMeal.protein} onChange={e => setManualMeal({...manualMeal, protein: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="g" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Carbs (g)</label>
                    <input type="number" min="0" value={manualMeal.carbs} onChange={e => setManualMeal({...manualMeal, carbs: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="g" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Fat (g)</label>
                    <input type="number" min="0" value={manualMeal.fat} onChange={e => setManualMeal({...manualMeal, fat: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="g" />
                  </div>
                </div>
                
                <button type="submit" className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/25 transition-all">
                  Add Meal
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
"""

# Insert just before the last </div>
if '    </div>\n  );\n}\n' in code:
    code = code.replace('    </div>\n  );\n}\n', modal_jsx + '    </div>\n  );\n}\n')
else:
    # fallback
    parts = code.rsplit('</div>', 1)
    code = parts[0] + modal_jsx + '</div>' + parts[1]

# Make sure AnimatePresence is imported
if 'AnimatePresence' not in code.split('framer-motion')[0]:
    code = code.replace('import { motion } from \'framer-motion\';', 'import { motion, AnimatePresence } from \'framer-motion\';')

with open('frontend/src/pages/Dashboard.tsx', 'w') as f:
    f.write(code)
