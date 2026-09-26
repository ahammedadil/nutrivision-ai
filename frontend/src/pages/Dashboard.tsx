import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Activity, Plus, Camera, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const [showLogModal, setShowLogModal] = useState(false);
  const [manualMeal, setManualMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const navigate = useNavigate();
  const { name, streak, dailyGoal, dailyConsumed, recentMeals, addMeal } = useStore();

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
  };

  const proteinPercent = Math.min(100, (dailyConsumed.protein / dailyGoal.protein) * 100);
  const carbsPercent = Math.min(100, (dailyConsumed.carbs / dailyGoal.carbs) * 100);
  const fatPercent = Math.min(100, (dailyConsumed.fat / dailyGoal.fat) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Good Evening, {name} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Here is your AI nutrition summary for today.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-orange-500">{streak} Day Streak!</span>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calories Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all duration-500" />
          
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500"/> Today's Macros
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Calories</div>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {dailyConsumed.calories}
                <span className="text-lg text-slate-500 font-medium ml-1">/ {dailyGoal.calories}</span>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">Protein</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{dailyConsumed.protein}g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${proteinPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">Carbs</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{dailyConsumed.carbs}g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${carbsPercent}%` }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">Fat</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{dailyConsumed.fat}g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${fatPercent}%` }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl flex flex-col justify-center gap-4">
          <button 
            onClick={() => navigate('/scanner')}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="w-5 h-5" />
            Scan Food
          </button>
          <button onClick={() => setShowLogModal(true)} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Log Manually
          </button>
        </motion.div>

      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" /> Recent Meals
        </h2>
        
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          {recentMeals.map((meal, idx) => (
            <motion.div key={meal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (idx * 0.1) }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-200 dark:group-hover:border-orange-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-300">
                <span className="text-xs font-bold">{meal.time.split(' ')[0]}</span>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-5 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <span className="font-bold text-orange-500">{meal.calories} kcal</span>
                </div>
                <div className="flex gap-3 text-sm text-slate-500 font-medium">
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fat}g</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
    </div>
  );
}
