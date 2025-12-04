import React, { useEffect } from 'react';
import { Highlight } from '../types';
import { X } from 'lucide-react';

interface HighlightViewerProps {
  highlight: Highlight | null;
  onClose: () => void;
}

export const HighlightViewer: React.FC<HighlightViewerProps> = ({ highlight, onClose }) => {
  useEffect(() => {
    if (highlight) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [highlight]);

  if (!highlight) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-200">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <X size={32} />
      </button>

      <div className="w-full max-w-md h-full md:h-[80vh] flex flex-col relative">
        {/* Progress bar simulation */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            <div className="h-1 bg-white/50 flex-1 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[progress_5s_linear_forwards]" />
            </div>
        </div>

        <img 
          src={highlight.imageUrl} 
          alt={highlight.title} 
          className="w-full h-full object-cover md:rounded-2xl"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent md:rounded-b-2xl">
           <h2 className="text-white font-bold text-xl">{highlight.title}</h2>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
        }
      `}</style>
    </div>
  );
};