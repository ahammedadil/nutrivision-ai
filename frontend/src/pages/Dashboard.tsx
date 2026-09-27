import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { dailyConsumed, dailyGoals, recentMeals } = useStore();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Calculate NOVA Score (Simple logic based on goals)
  const calPercent = Math.min((dailyConsumed.calories / dailyGoals.calories) * 100, 100) || 0;
  const proPercent = Math.min((dailyConsumed.protein / dailyGoals.protein) * 100, 100) || 0;
  
  // Score out of 100 based on hitting protein without going over calories
  const novaScore = Math.round((proPercent * 0.6) + ((100 - Math.abs(100 - calPercent)) * 0.4)) || 0;
  let scoreText = "NEEDS DATA";
  if (novaScore > 85) scoreText = "EXCELLENT";
  else if (novaScore > 70) scoreText = "GOOD";
  else if (novaScore > 50) scoreText = "FAIR";

  const getStrokeColor = (val: number, goal: number, isCalories = false) => {
    if (val === 0) return 'var(--color-nova-elevated)';
    const pct = val / goal;
    if (isCalories && pct > 1.1) return 'var(--color-nova-red)'; // Too many calories
    if (!isCalories && pct >= 0.9) return 'var(--color-nova-green)'; // Hit protein/target
    if (pct > 0.4) return 'var(--color-nova-blue)';
    return 'var(--color-nova-yellow)';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto p-6 pt-12 md:pt-16 font-sans"
    >
      {/* Header */}
      <header className="mb-12">
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-[44px] font-medium leading-[1.1] mb-4"
        >
          Good evening,<br/>Ahammed.
        </motion.h1>
        <p className="text-[var(--color-nova-text-secondary)]">{today}</p>
      </header>

      {/* NOVA SCORE Dial */}
      <section className="mb-16 flex flex-col items-center justify-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--color-nova-text-secondary)] mb-6 uppercase">
          NOVA Score
        </p>
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="96" cy="96" r="88" 
              fill="none" 
              stroke="var(--color-nova-elevated)" 
              strokeWidth="4"
            />
            <motion.circle 
              cx="96" cy="96" r="88" 
              fill="none" 
              stroke="var(--color-nova-green)" 
              strokeWidth="4"
              strokeDasharray="553"
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * (novaScore / 100)) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <span className="text-6xl font-medium tabular-nums tracking-tighter">{novaScore}</span>
          </motion.div>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="h-[1px] flex-1 bg-[var(--color-nova-border)]"></div>
          <span className="text-xs font-medium tracking-widest text-[var(--color-nova-green)] uppercase">
            {scoreText}
          </span>
          <div className="h-[1px] flex-1 bg-[var(--color-nova-border)]"></div>
        </div>
      </section>

      {/* TODAY'S MACROS */}
      <section className="mb-16">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--color-nova-text-secondary)] mb-8 uppercase">
          Today
        </p>
        
        <div className="flex flex-col gap-8">
          {/* Calories */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex flex-col">
                <span className="text-4xl font-medium tabular-nums leading-none tracking-tight">
                  {dailyConsumed.calories.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--color-nova-text-secondary)] uppercase tracking-wider mt-1">
                  Calories
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-xl text-[var(--color-nova-text-muted)] tabular-nums leading-none">
                  {dailyGoals.calories.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--color-nova-text-muted)] uppercase tracking-wider mt-1">
                  Goal
                </span>
              </div>
            </div>
            <div className="w-full h-1 bg-[var(--color-nova-elevated)] rounded-full overflow-hidden mt-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(calPercent, 100)}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: getStrokeColor(dailyConsumed.calories, dailyGoals.calories, true) }}
              />
            </div>
          </div>

          <div className="h-[1px] w-full bg-[var(--color-nova-border)] my-2"></div>

          {/* Macros */}
          {[
            { label: 'Protein', val: dailyConsumed.protein, goal: dailyGoals.protein },
            { label: 'Carbs', val: dailyConsumed.carbs, goal: dailyGoals.carbs },
            { label: 'Fat', val: dailyConsumed.fat, goal: dailyGoals.fat },
          ].map((macro) => {
            const pct = Math.min((macro.val / macro.goal) * 100, 100) || 0;
            return (
              <div key={macro.label}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-[var(--color-nova-text-secondary)] uppercase tracking-wider">
                    {macro.label}
                  </span>
                  <div className="text-right flex items-baseline gap-2">
                    <span className="text-2xl font-medium tabular-nums">{macro.val}g</span>
                    <span className="text-sm text-[var(--color-nova-text-muted)] tabular-nums w-12 text-right">
                      {macro.goal}g
                    </span>
                  </div>
                </div>
                <div className="w-full h-1 bg-[var(--color-nova-elevated)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getStrokeColor(macro.val, macro.goal) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mb-12">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--color-nova-text-secondary)] mb-6 uppercase">
          My Day
        </p>
        
        {recentMeals.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-nova-text-muted)] text-sm">
            No meals logged today.
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center py-4 border-b border-[var(--color-nova-border)] group">
                <div className="flex gap-6 items-center">
                  <span className="text-[var(--color-nova-text-muted)] tabular-nums text-sm">
                    {meal.time.split(' ')[0]}
                  </span>
                  <span className="text-base font-medium group-hover:text-[var(--color-nova-text)] text-[var(--color-nova-text-secondary)] transition-colors">
                    {meal.name}
                  </span>
                </div>
                <span className="tabular-nums font-medium text-[var(--color-nova-text)]">
                  {meal.calories}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MOBILE SCAN CTA */}
      <div className="md:hidden flex justify-center pb-8">
        <button 
          onClick={() => navigate('/scanner')}
          className="text-xs font-medium tracking-widest text-[var(--color-nova-text)] hover:text-white transition-colors uppercase flex items-center gap-2"
        >
          [ + Scan Meal ]
        </button>
      </div>

    </motion.div>
  );
}
