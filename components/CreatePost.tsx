import React, { useState } from 'react';
import { User } from '../types';
import { geminiService } from '../services/geminiService';
import { Loader2, Wand2, Image as ImageIcon, Send } from 'lucide-react';

interface CreatePostProps {
  user: User;
  onPostCreated: (content: string, imageUrl?: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMagicLoop = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    try {
      const improvedContent = await geminiService.generatePostImprovement(content);
      setContent(improvedContent);
    } catch (error) {
      alert("Não foi possível gerar o texto mágico agora.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // Simulate an image attachment randomly for demo purposes if keyword is present
    let imageUrl = undefined;
    if (content.toLowerCase().includes('foto') || content.toLowerCase().includes('imagem')) {
        imageUrl = `https://picsum.photos/seed/${Math.random()}/800/400`;
    }

    onPostCreated(content, imageUrl);
    setContent('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 transition-colors">
      <div className="flex gap-4">
        <img 
          src={user.avatarUrl} 
          alt={user.name} 
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que está acontecendo no seu mundo?"
              className="w-full resize-none border-none focus:ring-0 text-gray-700 dark:text-gray-200 bg-transparent text-lg placeholder-gray-400 min-h-[80px]"
            />
            
            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-full transition-colors"
                  title="Adicionar imagem"
                >
                  <ImageIcon size={20} />
                </button>
                
                <button
                  type="button"
                  onClick={handleMagicLoop}
                  disabled={isGenerating || !content.trim()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isGenerating 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 hover:from-purple-200 hover:to-pink-200'
                  }`}
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                  Magic Loop
                </button>
              </div>

              <button
                type="submit"
                disabled={!content.trim()}
                className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                Publicar <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
