import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Camera, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Scanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    "Analyzing Food...",
    "Detecting Ingredients...",
    "Estimating Weight...",
    "Finding Nutrition...",
    "Almost Done..."
  ];

  useEffect(() => {
    let interval: number;
    if (isProcessing) {
      interval = window.setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 1500);
    }
    return () => window.clearInterval(interval);
  }, [isProcessing, loadingTexts.length]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Mock network delay to show off the fancy loading animation
      await new Promise(r => setTimeout(r, 4000));
      
      // 1. Detect if the user is running the website on their local laptop
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      // 2. FORCE the correct backend URL. If they are on Vercel (phone), ALWAYS use Render!
      let apiUrl = 'https://nutrivision-ai-4cmr.onrender.com';
      if (isLocalhost) {
          apiUrl = 'http://127.0.0.1:5000';
      }
      
      const response = await axios.post(`${apiUrl}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // We pass the results and the image via React Router state
      navigate('/results', { 
        state: { 
          results: response.data, 
          imagePreview: URL.createObjectURL(file) 
        } 
      });
    } catch (error: any) {
        console.error('Scan error:', error);
        
        let errorMsg = 'Failed to analyze image. Make sure the backend is running.';
        
        if (error.response) {
            if (error.response.data && error.response.data.error) {
                errorMsg = 'Backend JSON Error: ' + error.response.data.error;
            } else if (typeof error.response.data === 'string') {
                errorMsg = 'Backend HTTP Error ' + error.response.status + ': (HTML Returned)';
            } else {
                errorMsg = 'Backend Error Status: ' + error.response.status;
            }
        } else if (error.message) {
            errorMsg = 'Network/Client Error: ' + error.message;
        }
        
        alert(errorMsg);
        setIsProcessing(false);
        setImagePreview(null);
      }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <button 
        onClick={() => navigate(-1)}
        className="self-start flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-panel hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-red-500/5 blur-3xl pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.div 
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <div className="glass-panel border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-12 text-center relative overflow-hidden group">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">What's on your plate?</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto">
                  Take a photo or upload an image to instantly analyze the nutritional breakdown.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-1"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </button>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all hover:-translate-y-1"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Upload Image
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 aspect-[4/3] sm:aspect-video">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                  
                  <div className="relative w-24 h-24 mb-8">
                    <svg className="animate-spin w-full h-full text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.h3 
                      key={loadingTextIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-2xl font-bold text-white text-center"
                    >
                      {loadingTexts[loadingTextIndex]}
                    </motion.h3>
                  </AnimatePresence>
                  
                  <div className="mt-8 w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </div>

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
