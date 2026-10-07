import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Results from './pages/Results';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import MealsList from './pages/MealsList';
import { AnimatePresence } from 'framer-motion';
import { Home, List, ScanLine, BarChart2, User } from 'lucide-react';

export default function App() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Home' },
    { path: '/meals', icon: <List size={22} />, label: 'Meals' },
    { path: '/scanner', icon: <ScanLine size={24} />, label: 'Scan', isAction: true },
    { path: '/insights', icon: <BarChart2 size={22} />, label: 'Insights' },
    { path: '/profile', icon: <User size={22} />, label: 'You' }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-nova-bg)] text-[var(--color-nova-text)] font-sans selection:bg-[var(--color-nova-green)]/30 overflow-x-hidden flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-[var(--color-nova-border)] bg-[var(--color-nova-surface)] px-6 py-8 z-50">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-16">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#dc2626] flex items-center justify-center text-white font-bold text-xl shadow-lg">
            N
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            NOVA
          </span>
        </Link>
        
        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-4 font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'text-white' 
                  : 'text-[var(--color-nova-text-secondary)] hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 relative z-10 pb-24 md:pb-0 min-h-screen">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meals" element={<MealsList />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/results" element={<Results />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--color-nova-elevated)] border-t border-[var(--color-nova-border)] flex items-center justify-around px-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                item.isAction 
                  ? 'text-[var(--color-nova-bg)] bg-[var(--color-nova-text)] rounded-full -translate-y-4 shadow-lg shadow-black/50'
                  : isActive 
                    ? 'text-[var(--color-nova-green)]' 
                    : 'text-[var(--color-nova-text-muted)] hover:text-white'
              }`}
            >
              {item.icon}
              {!item.isAction && <span className="text-[10px] mt-1 font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
