import React, { useState, useEffect } from 'react';
import { X, Send, Type } from 'lucide-react';
import { loopService } from '../services/LoopDataService';

interface CreateStoryModalProps {
  file: File | null;
  onClose: () => void;
  onPosted: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ file, onClose, onPosted }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        if (file.type.startsWith('video')) {
            setMediaType('video');
        } else {
            setMediaType('image');
        }
    }
  }, [file]);

  if (!file || !previewUrl) return null;

  const handlePost = () => {
      // Create story with the object URL (simulated upload)
      // In a real app, upload to server here
      loopService.createStory(previewUrl, mediaType);
      onPosted();
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
        {/* Header Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-20 bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={onClose} className="p-2 text-white bg-black/20 backdrop-blur-md rounded-full">
                <X size={24} />
            </button>
            <div className="flex gap-4">
                 <button className="p-2 text-white bg-black/20 backdrop-blur-md rounded-full">
                    <Type size={24} />
                 </button>
            </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
            {mediaType === 'image' ? (
                <img src={previewUrl} className="max-h-full max-w-full object-contain" alt="Story Preview" />
            ) : (
                <video src={previewUrl} className="max-h-full max-w-full" controls autoPlay loop playsInline />
            )}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-end z-20 bg-gradient-to-t from-black/80 to-transparent pb-10">
            <button 
                onClick={handlePost}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors"
            >
                Seu Story
                <div className="bg-cyan-500 rounded-full p-1 ml-1 text-white">
                     <Send size={16} />
                </div>
            </button>
        </div>
    </div>
  );
};