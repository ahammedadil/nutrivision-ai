import os

with open('frontend/src/pages/Scanner.tsx', 'r') as f:
    code = f.read()

# Add state
code = code.replace('const [isProcessing, setIsProcessing] = useState(false);', 'const [isProcessing, setIsProcessing] = useState(false);\n  const [errorUI, setErrorUI] = useState<string | null>(null);')

# Update catch block
catch_target = """        alert(errorMsg);
        setIsProcessing(false);
        setImagePreview(null);"""
catch_replace = """        setErrorUI(errorMsg);
        setIsProcessing(false);"""
code = code.replace(catch_target, catch_replace)

# Update loading text array to have a fallback message for long waits
loading_texts_target = """const loadingTexts = [
  "Analyzing image...",
  "Detecting ingredients...",
  "Calculating macros...",
  "Almost done..."
];"""
loading_texts_replace = """const loadingTexts = [
  "Analyzing image...",
  "Detecting ingredients...",
  "Calculating macros...",
  "Google AI is busy, retrying...",
  "Still trying, please hold...",
  "Almost done..."
];"""
code = code.replace(loading_texts_target, loading_texts_replace)

# Update the JSX to show ErrorUI if it exists, otherwise spinner
jsx_target = """                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                  
                  <div className="relative w-24 h-24 mb-8">"""

jsx_replace = """                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                  
                  {errorUI ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-sm text-center backdrop-blur-md"
                    >
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                      <p className="text-red-200 text-sm mb-6 max-h-32 overflow-y-auto">{errorUI}</p>
                      <button 
                        onClick={() => { setErrorUI(null); setImagePreview(null); }}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
                      >
                        Try Another Image
                      </button>
                    </motion.div>
                  ) : (
                    <>
                  <div className="relative w-24 h-24 mb-8">"""

code = code.replace(jsx_target, jsx_replace)

jsx_end_target = """                  </div>

                </div>
              </div>
            </motion.div>"""

jsx_end_replace = """                  </div>
                  </>
                  )}

                </div>
              </div>
            </motion.div>"""

code = code.replace(jsx_end_target, jsx_end_replace)

# Fix early exit for input
code = code.replace('if (!file) return;', 'if (!file) return;\n    setErrorUI(null);')

with open('frontend/src/pages/Scanner.tsx', 'w') as f:
    f.write(code)
