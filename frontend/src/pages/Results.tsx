import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

interface BBox {
  x1: number; y1: number; x2: number; y2: number;
}
interface DetectedFood {
  name: string;
  confidence: number;
  bbox: BBox;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  serving_size?: string;
  error?: string;
}
interface PredictionResponse {
  foods: DetectedFood[];
  total: { calories: number; protein: number; carbs: number; fat: number; };
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addMeal } = useStore();
  
  const state = location.state as { results?: PredictionResponse, imagePreview?: string };
  const [hasLogged, setHasLogged] = useState(false);

  useEffect(() => {
    if (!state?.results) {
      navigate('/scanner', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.results) return null;
  const { results, imagePreview } = state;

  const handleLogMeal = () => {
    if (hasLogged || results.foods.length === 0) return;
    
    const mealName = results.foods.map(f => f.name.charAt(0).toUpperCase() + f.name.slice(1)).join(', ');
    
    addMeal({
      id: Date.now().toString(),
      name: mealName,
      calories: results.total.calories,
      protein: results.total.protein,
      carbs: results.total.carbs,
      fat: results.total.fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    setHasLogged(true);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/scanner')}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Scan Another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-[2rem] overflow-hidden glass-panel border border-slate-200 dark:border-slate-800/50 shadow-2xl shadow-black/5 h-fit">
          <img src={imagePreview} alt="Scanned Food" className="w-full h-auto object-cover" />
        </motion.div>

        {/* Right: Nutrition Data */}
        <div className="space-y-6">
          {results.foods.length === 0 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-10 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[300px]">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <AlertCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold">Meal Not Recognized</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                This doesn't match any foods in our training dataset. Please ensure the image is clear and contains a supported dish.
              </p>
            </motion.div>
          ) : (
            <>
              {results.foods.map((food, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="glass-panel p-8 rounded-[2rem] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{food.name}</h2>
                      <p className="text-slate-500 font-medium">{food.serving_size || 'Unknown serving'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-extrabold text-orange-500">
                        {food.calories || 0}
                      </div>
                      <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">kcal</div>
                    </div>
                  </div>

                  {food.calories !== undefined ? (
                    <div className="space-y-5">
                      {/* Protein */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Protein</span>
                          <span className="font-bold text-slate-500">{food.protein}g</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((food.protein||0)/50)*100)}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-slate-800 dark:bg-slate-200 rounded-full" />
                        </div>
                      </div>
                      {/* Carbs */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Carbs</span>
                          <span className="font-bold text-slate-500">{food.carbs}g</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((food.carbs||0)/100)*100)}%` }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-slate-800 dark:bg-slate-200 rounded-full" />
                        </div>
                      </div>
                      {/* Fat */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Fat</span>
                          <span className="font-bold text-slate-500">{food.fat}g</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((food.fat||0)/30)*100)}%` }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-slate-800 dark:bg-slate-200 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-500 font-medium">{food.error}</p>
                  )}
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={handleLogMeal}
                disabled={hasLogged}
                className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  hasLogged 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-1'
                }`}
              >
                {hasLogged ? "Meal Logged!" : <><Plus className="w-5 h-5" /> Log to Dashboard</>}
              </motion.button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
