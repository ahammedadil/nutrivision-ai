import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://nova-production.up.railway.app';

export default function Scanner() {
  const navigate = useNavigate();
  const { setLastScannedFoods } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorUI, setErrorUI] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Detecting food",
    "Estimating portion",
    "Calculating nutrition",
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingSteps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsProcessing(true);
    setErrorUI(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      setLastScannedFoods(response.data.foods);
      setIsProcessing(false);
      navigate('/results');
    } catch (error: any) {
      setErrorUI(error.message || "Failed to analyze image");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 min-h-screen flex flex-col font-sans">
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full text-center"
            >
              <h1 className="text-3xl font-medium mb-12">
                What's on your plate?
              </h1>

              <div className="border border-[var(--color-nova-border)] bg-[var(--color-nova-surface)] rounded-2xl p-12 mb-12 flex items-center justify-center">
                 <span className="text-[var(--color-nova-text-secondary)] tracking-widest text-sm uppercase">Food</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-nova-text)] text-[var(--color-nova-bg)] hover:scale-105 rounded-full font-medium transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Scan your meal
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-nova-surface)] hover:bg-[var(--color-nova-elevated)] border border-[var(--color-nova-border)] text-white rounded-full font-medium transition-all"
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative max-w-md mx-auto"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square relative">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-30 grayscale" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  {errorUI ? (
                    <div className="text-center">
                      <div className="text-[var(--color-nova-red)] mb-4 uppercase tracking-widest text-xs font-medium">Analysis Failed</div>
                      <p className="text-[var(--color-nova-text-secondary)] text-sm mb-8">{errorUI}</p>
                      <button 
                        onClick={() => { setErrorUI(null); setImagePreview(null); }}
                        className="px-6 py-3 bg-[var(--color-nova-surface)] hover:bg-[var(--color-nova-elevated)] border border-[var(--color-nova-border)] rounded-full text-xs font-medium tracking-widest uppercase transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-[200px]">
                      <div className="text-[var(--color-nova-text)] uppercase tracking-widest text-[10px] mb-8 text-center animate-pulse">
                        Analyzing
                      </div>
                      <div className="space-y-6">
                        {loadingSteps.map((step, idx) => (
                          <div key={idx} className="relative">
                            <div className={`text-xs uppercase tracking-wider mb-2 transition-colors duration-500 ${idx <= loadingStep ? 'text-[var(--color-nova-text)]' : 'text-[var(--color-nova-text-muted)]'}`}>
                              {step}
                            </div>
                            <div className="h-[1px] w-full bg-[var(--color-nova-border)] relative overflow-hidden">
                              {idx <= loadingStep && (
                                <motion.div 
                                  initial={{ x: "-100%" }}
                                  animate={{ x: idx < loadingStep ? "0%" : ["-100%", "100%"] }}
                                  transition={{ 
                                    duration: idx < loadingStep ? 0.3 : 1.5, 
                                    repeat: idx < loadingStep ? 0 : Infinity, 
                                    ease: "linear" 
                                  }}
                                  className="absolute inset-0 bg-[var(--color-nova-text)]"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <input 
          type="file"
          ref={cameraInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
      </div>
    </div>
  );
}
