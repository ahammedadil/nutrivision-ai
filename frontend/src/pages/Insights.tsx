import { motion } from 'framer-motion';

export default function Insights() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-2xl mx-auto min-h-screen"
    >
      <h1 className="text-3xl font-medium mb-8 uppercase tracking-widest text-[var(--color-nova-text-secondary)]">
        Insights
      </h1>
      <div className="text-[var(--color-nova-text-muted)]">
        Coming soon...
      </div>
    </motion.div>
  );
}
