import React, { useRef } from 'react';
import { Story, User } from '../types';
import { Plus } from 'lucide-react';
import { loopService } from '../services/LoopDataService';

interface StoryItemProps {
  story?: Story;
  user?: User;
  isAddMode?: boolean;
  currentUser?: User;
  onAddStoryClick?: () => void;
  onClick?: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, user, isAddMode = false, currentUser, onAddStoryClick, onClick }) => {
  if (isAddMode) {
    if (!currentUser || !onAddStoryClick) return null;
    return (
      <button onClick={onAddStoryClick} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group relative">
        <div className="relative w-[72px] h-[72px]">
             {/* Gradient Border Simulation */}
             <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-cyan-500 transition-colors"></div>
             <div className="absolute inset-[3px] rounded-full overflow-hidden">
                <img 
                    src={currentUser.avatarUrl} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                    alt="Add Story"
                />
             </div>
             <div className="absolute bottom-0 right-0 bg-cyan-500 text-white rounded-full p-1 border-2 border-white dark:border-[#0f1117] shadow-lg group-hover:scale-110 transition-transform">
                <Plus size={16} strokeWidth={3} />
             </div>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Seu story</span>
      </button>
    );
  }

  if (!user || !story) return null;

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
      <div className={`relative w-[72px] h-[72px] p-[2px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          story.isViewed 
            ? 'bg-gray-200 dark:bg-gray-700' 
            : 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 animate-[spin_4s_linear_infinite_paused] group-hover:animate-none'
        }`}>
        <div className="bg-white dark:bg-[#0f1117] rounded-full p-[2px] w-full h-full">
           <img 
             src={user.avatarUrl} 
             className="w-full h-full rounded-full object-cover" 
             alt={user.name} 
           />
        </div>
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-300 truncate w-20 text-center font-medium">{user.name.split(' ')[0]}</span>
    </button>
  );
};

interface StoryRailProps {
  stories: Story[];
  currentUser: User;
  onAddStoryStart: (file: File) => void;
  onViewStory: (story: Story) => void;
}

export const StoryRail: React.FC<StoryRailProps> = ({ stories, currentUser, onAddStoryStart, onViewStory }) => {
  const hasMyStory = stories.some(s => s.userId === currentUser.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          onAddStoryStart(file);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  };

  // Group stories by user (only show one circle per user)
  const uniqueUserStories = Array.from(new Set(stories.map(s => s.userId)))
    .map(userId => stories.find(s => s.userId === userId))
    .filter(s => s !== undefined) as Story[];

  return (
    <div className="flex gap-2 overflow-x-auto pb-6 pt-2 px-1 scrollbar-hide no-scrollbar items-start">
       {/* Hidden File Input */}
       <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*,video/*" 
          className="hidden" 
       />

       {!hasMyStory && (
         <StoryItem 
           isAddMode={true} 
           currentUser={currentUser} 
           onAddStoryClick={triggerFileSelect} 
         />
       )}
       
       {uniqueUserStories.map(story => (
         <StoryItem 
           key={story.userId} 
           story={story} 
           user={loopService.getUserById(story.userId)} 
           onClick={() => onViewStory(story)}
         />
       ))}
    </div>
  );
};