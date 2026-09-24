import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Results from './pages/Results';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Floating Navbar */}
      <header className="sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel px-6 py-4 rounded-full flex items-center justify-between shadow-lg shadow-black/5">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
              N
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
              NutriVision <span className="text-slate-400 dark:text-slate-500 font-medium">AI</span>
            </span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/" className={`font-semibold transition-colors ${location.pathname === '/' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Dashboard</Link>
            <Link to="/scanner" className={`font-semibold transition-colors ${location.pathname === '/scanner' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Scan Meal</Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </AnimatePresence>
      </main>

    </div>
  );
}
