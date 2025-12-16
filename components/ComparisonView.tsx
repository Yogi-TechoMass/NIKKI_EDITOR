import React from 'react';
import { Download, ArrowRight, RefreshCw } from 'lucide-react';

interface ComparisonViewProps {
  original: string;
  generated: string | null;
  onDownload: () => void;
  isProcessing: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  original, 
  generated, 
  onDownload,
  isProcessing 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-fade-in">
      {/* Original Image */}
      <div className="relative group rounded-2xl overflow-hidden border border-gray-800 bg-nikki-panel aspect-square md:aspect-auto md:h-[500px]">
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white z-10">
          Original
        </div>
        <img 
          src={original} 
          alt="Original" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Generated Image */}
      <div className="relative group rounded-2xl overflow-hidden border border-gray-800 bg-nikki-panel aspect-square md:aspect-auto md:h-[500px]">
        <div className="absolute top-4 left-4 bg-nikki-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-nikki-black z-10 flex items-center gap-2">
          {isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
          {isProcessing ? 'Processing...' : 'Result'}
        </div>
        
        {generated ? (
          <>
             <img 
              src={generated} 
              alt="Generated" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={onDownload}
                className="bg-white text-black p-3 rounded-full hover:scale-105 transition-transform shadow-lg"
                title="Download"
              >
                <Download size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-black/20">
            {isProcessing ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="relative w-16 h-16">
                   <div className="absolute inset-0 rounded-full border-4 border-nikki-accent/30"></div>
                   <div className="absolute inset-0 rounded-full border-4 border-t-nikki-accent animate-spin"></div>
                 </div>
                 <p className="text-sm font-medium animate-pulse">Nikki is thinking...</p>
               </div>
            ) : (
              <>
                <ArrowRight size={48} className="opacity-20 mb-4" />
                <p>Edit result will appear here</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
