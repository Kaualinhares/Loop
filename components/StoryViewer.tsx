import React, { useEffect, useState } from 'react';
import { Story, User } from '../types';
import { X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { loopService } from '../services/LoopDataService';

interface StoryViewerProps {
  initialStory: Story | null;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ initialStory, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (initialStory) {
        const stories = loopService.getStoriesByUser(initialStory.userId);
        setUserStories(stories);
        const index = stories.findIndex(s => s.id === initialStory.id);
        setCurrentStoryIndex(index >= 0 ? index : 0);
        setUser(loopService.getUserById(initialStory.userId));
        document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [initialStory]);

  // Progress Bar Logic (Auto advance)
  useEffect(() => {
    setProgress(0);
    const story = userStories[currentStoryIndex];
    if (!story) return;

    // If video, we wait for video end (handled in onEnded), if image, 5 seconds
    if (story.mediaType === 'image') {
        const duration = 5000;
        const interval = 50;
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    handleNext();
                    return 0;
                }
                return prev + (interval / duration) * 100;
            });
        }, interval);
        return () => clearInterval(timer);
    }
  }, [currentStoryIndex, userStories]);

  if (!initialStory || !user || userStories.length === 0) return null;

  const currentStory = userStories[currentStoryIndex];

  const handleNext = () => {
      if (currentStoryIndex < userStories.length - 1) {
          setCurrentStoryIndex(prev => prev + 1);
      } else {
          onClose();
      }
  };

  const handlePrev = () => {
      if (currentStoryIndex > 0) {
          setCurrentStoryIndex(prev => prev - 1);
      }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black flex items-center justify-center">
        {/* Background Blur */}
        <div className="absolute inset-0 z-0">
             <img src={currentStory.imageUrl} className="w-full h-full object-cover opacity-30 blur-3xl scale-150" />
        </div>

        {/* Player Container - Full screen mobile, modal desktop */}
        <div className="relative w-full md:w-[400px] h-[100dvh] md:h-[90vh] md:rounded-3xl overflow-hidden bg-gray-900 shadow-2xl z-10">
            
            {/* Progress Bars */}
            <div className="absolute top-2 md:top-4 left-2 right-2 flex gap-1 z-20">
                {userStories.map((_, idx) => (
                    <div key={idx} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{ 
                                width: idx < currentStoryIndex ? '100%' : idx === currentStoryIndex ? `${progress}%` : '0%' 
                            }} 
                        />
                    </div>
                ))}
            </div>

            {/* Header User Info */}
            <div className="absolute top-6 md:top-8 left-4 flex items-center gap-3 z-20 mt-2 md:mt-0">
                 <img src={user.avatarUrl} className="w-9 h-9 rounded-full border border-white/50" />
                 <span className="text-white font-semibold text-sm drop-shadow-md">{user.name}</span>
                 <span className="text-white/70 text-xs">2 h</span>
            </div>

            <button onClick={onClose} className="absolute top-6 md:top-8 right-4 text-white z-20 p-1 mt-2 md:mt-0">
                <X size={24} />
            </button>

            {/* Navigation Areas */}
            <div className="absolute inset-0 flex z-10">
                <div className="w-1/3 h-full" onClick={handlePrev}></div>
                <div className="w-2/3 h-full" onClick={handleNext}></div>
            </div>

            {/* Media Content */}
            <div className="w-full h-full flex items-center justify-center bg-black">
                {currentStory.mediaType === 'image' ? (
                    <img src={currentStory.imageUrl} className="w-full h-full object-cover" />
                ) : (
                    <video 
                        src={currentStory.imageUrl} 
                        className="w-full h-full object-contain" 
                        autoPlay 
                        playsInline
                        onTimeUpdate={(e) => {
                           const v = e.currentTarget;
                           setProgress((v.currentTime / v.duration) * 100);
                        }}
                        onEnded={handleNext}
                    />
                )}
            </div>

            {/* Footer Input */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 flex gap-3 items-center pb-8 md:pb-4">
                <input 
                    type="text" 
                    placeholder={`Responder a ${user.name}...`}
                    className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-3 text-white placeholder-white/70 text-sm focus:outline-none focus:border-white"
                />
                <button className="text-white p-2">
                    <Heart size={28} />
                </button>
                <button className="text-white p-2">
                    <Send size={28} />
                </button>
            </div>
        </div>

        {/* Desktop Navigation Arrows */}
        <button onClick={handlePrev} className="hidden md:block absolute left-4 lg:left-20 text-white/50 hover:text-white p-4 bg-white/10 rounded-full backdrop-blur-md transition-colors z-50">
            <ChevronLeft size={32} />
        </button>
        <button onClick={handleNext} className="hidden md:block absolute right-4 lg:right-20 text-white/50 hover:text-white p-4 bg-white/10 rounded-full backdrop-blur-md transition-colors z-50">
            <ChevronRight size={32} />
        </button>

    </div>
  );
};