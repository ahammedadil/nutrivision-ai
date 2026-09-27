import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const { lastScannedFoods, addMeal } = useStore();

  const [multipliers, setMultipliers] = useState<{ [key: number]: number }>(
    lastScannedFoods.reduce((acc, _, idx) => ({ ...acc, [idx]: 1 }), {})
  );

  const handleAdjust = (index: number, delta: number) => {
    setMultipliers(prev => ({
      ...prev,
      [index]: Math.max(0.5, prev[index] + delta)
    }));
  };

  const handleAddAll = () => {
    lastScannedFoods.forEach((food, idx) => {
      const m = multipliers[idx];
      addMeal({
        id: crypto.randomUUID(),
        name: food.name,
        calories: Math.round(food.calories * m),
        protein: Math.round(food.protein * m),
        carbs: Math.round(food.carbs * m),
        fat: Math.round(food.fat * m),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    });
    navigate('/');
  };

  if (!lastScannedFoods || lastScannedFoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-[var(--color-nova-text-secondary)] mb-4">No foods found.</p>
        <button onClick={() => navigate('/scanner')} className="text-[var(--color-nova-text)] border border-[var(--color-nova-border)] px-4 py-2 rounded-full text-sm uppercase tracking-widest">
          Scan Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto p-6 pt-12 pb-32 font-sans"
    >
      <button 
        onClick={() => navigate(-1)}
        className="mb-12 flex items-center gap-2 text-[var(--color-nova-text-secondary)] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 
        <span className="text-xs uppercase tracking-widest">Back</span>
      </button>

      <div className="space-y-16">
        {lastScannedFoods.map((food, idx) => {
          const m = multipliers[idx];
          return (
            <div key={idx} className="flex flex-col">
              <h2 className="text-2xl font-medium tracking-tight uppercase mb-2">
                {food.name.split('(')[0].trim()}
              </h2>
              <div className="text-[var(--color-nova-text-secondary)] text-sm tracking-wide mb-8">
                Estimated portion<br/>
                <span className="text-[var(--color-nova-text)]">{food.serving_size}</span>
              </div>
              
              <div className="mb-12">
                <div className="text-5xl font-medium tabular-nums tracking-tighter leading-none mb-2">
                  {Math.round(food.calories * m)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-nova-text-muted)]">
                  KCAL
                </div>
              </div>

              <div className="space-y-4 mb-12">
                {[
                  { label: 'Protein', val: food.protein },
                  { label: 'Carbs', val: food.carbs },
                  { label: 'Fat', val: food.fat },
                  { label: 'Fiber', val: food.fiber || 0 },
                  { label: 'Sugar', val: food.sugar || 0 },
                ].map(macro => (
                  <div key={macro.label} className="flex justify-between items-center text-sm border-b border-[var(--color-nova-border)] pb-2">
                    <span className="uppercase tracking-widest text-[var(--color-nova-text-secondary)]">
                      {macro.label}
                    </span>
                    <span className="tabular-nums font-medium">
                      {Math.round(macro.val * m)}g
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-nova-text-muted)] mb-4">Portion</span>
                <div className="flex items-center gap-6">
                  <button onClick={() => handleAdjust(idx, -0.25)} className="text-[var(--color-nova-text-secondary)] hover:text-white p-2">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="tabular-nums font-medium text-lg w-12 text-center">
                    {m.toFixed(2)}x
                  </span>
                  <button onClick={() => handleAdjust(idx, 0.25)} className="text-[var(--color-nova-text-secondary)] hover:text-white p-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-20 md:bottom-8 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <button 
          onClick={handleAddAll}
          className="pointer-events-auto bg-[var(--color-nova-text)] text-[var(--color-nova-bg)] px-12 py-4 rounded-full font-medium tracking-widest uppercase shadow-2xl hover:scale-105 transition-transform"
        >
          Add to my day
        </button>
      </div>

    </motion.div>
  );
}
