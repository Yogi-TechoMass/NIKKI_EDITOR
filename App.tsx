import React, { useState, useRef, useEffect } from 'react';
import { NikkiLogo } from './components/NikkiLogo';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { ComparisonView } from './components/ComparisonView';
import { editImageWithGemini, fileToRawBase64 } from './services/geminiService';
import { AppState, ProcessedImage } from './types';
import { Wand2, RefreshCcw, ImagePlus, AlertCircle } from 'lucide-react';

const SAMPLE_PROMPTS = [
  "Add a neon sign saying 'Nikki' in the background",
  "Turn this into a cyberpunk city scene",
  "Make it look like a vintage polaroid",
  "Add a cute cat wearing sunglasses",
  "Change the sky to a galaxy night"
];

function App() {
  const [appState, setAppState] = useState<AppState>({ status: 'idle' });
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          original: e.target?.result as string,
          originalFile: file,
          generated: null,
          history: []
        });
        setAppState({ status: 'idle' }); // Ready for prompt
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setAppState({ status: 'error', errorMessage: 'Failed to load image.' });
    }
  };

  const handleGenerate = async () => {
    if (!image || !prompt.trim()) return;

    setAppState({ status: 'processing' });
    
    try {
      // Prepare inputs
      const rawBase64 = await fileToRawBase64(image.originalFile);
      const mimeType = image.originalFile.type;

      // Use either the previously generated image as source for iterative editing, 
      // or the original if it's the first edit. 
      // NOTE: For simplicity in this demo, we always edit from the *original* file uploaded 
      // to preserve quality, unless we implemented a way to turn the base64 result back into a file/blob properly for re-upload.
      // However, the prompt implies "users... use text prompts to edit images". 
      // Iterative editing is complex due to compression artifacts. Let's stick to Source -> Edit.
      
      const resultBase64 = await editImageWithGemini(rawBase64, mimeType, prompt);

      setImage(prev => prev ? { ...prev, generated: resultBase64 } : null);
      setAppState({ status: 'success' });

      // Scroll to result on mobile
      setTimeout(() => {
         bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (e: any) {
      setAppState({ 
        status: 'error', 
        errorMessage: e.message || "Something went wrong with the AI editor." 
      });
    }
  };

  const handleDownload = () => {
    if (image?.generated) {
      const link = document.createElement('a');
      link.href = image.generated;
      link.download = `nikki-edited-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPrompt('');
    setAppState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-nikki-black text-white font-sans selection:bg-nikki-accent selection:text-nikki-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-nikki-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <NikkiLogo size="sm" />
             <div className="hidden md:block h-6 w-px bg-white/20"></div>
             <span className="hidden md:block text-sm text-gray-400 tracking-wide font-medium">AI IMAGE EDITOR</span>
          </div>
          
          <div className="flex items-center gap-4">
            {image && (
              <button 
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <ImagePlus size={16} />
                <span className="hidden sm:inline">New Image</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {!image ? (
          /* Empty State / Upload */
          <div className="max-w-3xl mx-auto flex flex-col items-center animate-fade-in-up">
            <div className="mb-12 text-center space-y-4">
               <NikkiLogo size="lg" />
               <p className="text-xl text-gray-400 max-w-lg mx-auto">
                 Transform your photos with natural language. Powered by Gemini Nano Banana technology.
               </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelect} />
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <span className="text-nikki-accent text-lg font-bold">Upload</span>
                <p className="text-sm text-gray-500 mt-1">Select any photo</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <span className="text-nikki-accent text-lg font-bold">Prompt</span>
                <p className="text-sm text-gray-500 mt-1">Describe changes</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <span className="text-nikki-accent text-lg font-bold">Transform</span>
                <p className="text-sm text-gray-500 mt-1">Get AI results</p>
              </div>
            </div>
          </div>
        ) : (
          /* Editor Interface */
          <div className="flex flex-col gap-8">
            
            {/* Split View */}
            <ComparisonView 
              original={image.original}
              generated={image.generated}
              onDownload={handleDownload}
              isProcessing={appState.status === 'processing'}
            />

            {/* Controls Bar */}
            <div className="sticky bottom-6 z-40">
              <div className="max-w-4xl mx-auto bg-nikki-panel/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-6 ring-1 ring-black/50">
                
                {appState.status === 'error' && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {appState.errorMessage}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute top-3 left-4 text-gray-500 pointer-events-none">
                      <Wand2 size={20} />
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe how you want to edit this image..."
                      className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-nikki-accent focus:ring-1 focus:ring-nikki-accent transition-all resize-none h-[52px] md:h-auto min-h-[52px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={!prompt.trim() || appState.status === 'processing'}
                      isLoading={appState.status === 'processing'}
                    >
                      Generate
                    </Button>
                    {image.generated && (
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          setPrompt('');
                          setImage({ ...image, generated: null });
                        }}
                        title="Clear Result"
                        className="px-4"
                      >
                         <RefreshCcw size={20} />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade-right">
                  {SAMPLE_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(p)}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors border border-white/5"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} EDITOR NIKKI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
