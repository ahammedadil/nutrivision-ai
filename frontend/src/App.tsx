import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ChevronRight, Activity, Leaf, Droplet, Flame, ArrowRight, Loader2, Image as ImageIcon, Camera } from 'lucide-react';
import axios from 'axios';

interface BBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface FoodItem {
  name: string;
  confidence: number;
  bbox: BBox;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  serving_size?: string;
  error?: string;
}

interface NutritionTotal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface PredictionResponse {
  foods: FoodItem[];
  total: NutritionTotal;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'results'>('idle');
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [hoveredFood, setHoveredFood] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setStatus('processing');
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Mock delay for UI/UX demonstration of processing
      await new Promise(r => setTimeout(r, 2000));
      
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResults(response.data);
      setStatus('results');
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Failed to analyze image. Make sure the backend is running.");
      setStatus('idle');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                N
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                NutriVision <span className="text-slate-400 dark:text-slate-500">AI</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Removed placeholder links */}
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: IDLE (UPLOAD) */}
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              className="max-w-3xl mx-auto mt-10"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  From a single photo to <br className="hidden md:block"/>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-400">
                    complete nutritional intelligence.
                  </span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  Upload any meal to instantly identify foods, portion sizes, and detailed macronutrients powered by state-of-the-art computer vision.
                </p>
              </div>

              <div 
                className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-out overflow-hidden
                  ${preview ? 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center relative z-10">
                  {preview ? (
                    <div className="w-full h-full flex flex-col items-center gap-6">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 max-w-md w-full aspect-video md:aspect-square object-cover">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); reset(); }}
                          className="px-6 py-2.5 rounded-full font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          Change Photo
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); analyzeImage(); }}
                          className="px-8 py-2.5 rounded-full font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                        >
                          Analyze Meal <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className="w-10 h-10 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Drag & Drop your food photo</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8">or click to browse from your device</p>
                      
                      <div className="flex gap-4 text-sm font-medium text-slate-400 mb-6">
                        <div className="flex items-center gap-1"><ImageIcon className="w-4 h-4"/> JPG, PNG</div>
                        <div className="flex items-center gap-1"><Activity className="w-4 h-4"/> High Res</div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="px-6 py-3 rounded-full font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <UploadCloud className="w-5 h-5"/> Upload File
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                          className="px-6 py-3 rounded-full font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Camera className="w-5 h-5"/> Take Photo
                        </button>
                      </div>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/webp" 
                    onChange={handleFileChange}
                  />
                  <input 
                    type="file" 
                    ref={cameraInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 2: PROCESSING */}
          {status === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="relative w-48 h-48 mb-8">
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-orange-500/20"
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden opacity-50 relative">
                    {preview && <img src={preview} alt="Scanning" className="w-full h-full object-cover" />}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent h-[200%]"
                      animate={{ y: ["-100%", "50%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Analyzing Nutritional Profile...</h2>
              <p className="text-slate-500 dark:text-slate-400">Detecting ingredients, portion sizes, and macros.</p>
            </motion.div>
          )}

          {/* STATE 3: RESULTS */}
          {status === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Image & Detections */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel rounded-3xl overflow-hidden p-2 relative">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                    {preview && <img src={preview} alt="Analyzed" className="w-full h-full object-contain opacity-90" />}
                    
                    {/* Bounding Boxes */}
                    {results.foods.map((food, idx) => {
                      // Note: the backend bbox coords are in image pixel space.
                      // To draw them perfectly over the image requires knowing the intrinsic image dimensions vs rendered dimensions.
                      // For this demo UI, we'll assume the image fills the container or we'll just show abstract markers.
                      // Since we don't have natural dimensions readily available in standard img tag without onload,
                      // we'll just draw a nice overlay if we hover the food card.
                      const isHovered = hoveredFood === idx;
                      return (
                        <AnimatePresence key={idx}>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-sm"
                            >
                              <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl flex items-center gap-2">
                                <Activity className="w-5 h-5"/>
                                Locating {food.name}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={reset} className="flex-1 py-3 rounded-2xl font-medium text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    Analyze Another Meal
                  </button>
                </div>
              </div>

              {/* Right Column: Nutrition Data */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Total Summary */}
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500"/> Meal Summary
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Calories</div>
                      <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        {results.total.calories}
                        <span className="text-lg text-slate-500 font-medium ml-1">kcal</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-300">Protein</span>
                          <span className="font-bold text-orange-600 dark:text-orange-400">{results.total.protein}g</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (results.total.protein / 50) * 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-300">Carbs</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{results.total.carbs}g</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (results.total.carbs / 100) * 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-300">Fat</span>
                          <span className="font-bold text-orange-600 dark:text-orange-400">{results.total.fat}g</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (results.total.fat / 30) * 100)}%` }} />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Detected Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold px-2 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-orange-500" /> Detected Ingredients
                  </h3>
                  
                  {results.foods.map((food, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onHoverStart={() => setHoveredFood(idx)}
                      onHoverEnd={() => setHoveredFood(null)}
                      className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/30"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-xl font-bold capitalize">{food.name}</h4>
                              {food.confidence && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  food.confidence > 0.6 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-500/20 text-slate-400'
                                }`}>
                                  {Math.round(food.confidence * 100)}% Match
                                </span>
                              )}
                            </div>
                            {food.serving_size && (
                              <p className="text-sm text-slate-500 mt-1">{food.serving_size}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {food.calories !== undefined ? (
                              <span className="text-2xl font-bold text-orange-500">{food.calories} <span className="text-sm text-slate-500">kcal</span></span>
                            ) : (
                              <span className="text-sm text-red-400">{food.error}</span>
                            )}
                          </div>
                        </div>
                        
                        {food.calories !== undefined && (
                          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Protein</div>
                              <div className="font-semibold">{food.protein}g</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Carbs</div>
                              <div className="font-semibold">{food.carbs}g</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Fat</div>
                              <div className="font-semibold">{food.fat}g</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
