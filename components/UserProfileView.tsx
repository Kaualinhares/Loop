import React, { useState } from 'react';
import { User, Highlight, Post } from '../types';
import { loopService } from '../services/LoopDataService';
import { PostCard } from './PostCard';
import { ArrowLeft, Lock, Repeat } from 'lucide-react';
import { HighlightViewer } from './HighlightViewer';

interface UserProfileViewProps {
  userId: string;
  onBack: () => void;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ userId, onBack, onLikeToggle, onSaveToggle }) => {
  const user = loopService.getUserById(userId);
  const posts = loopService.getPostsByUser(userId);
  const reposts = loopService.getRepostsByUser(userId);
  const isFollowing = loopService.isFollowing(userId);
  const [activeProfileTab, setActiveProfileTab] = useState<'POSTS' | 'REPOSTS' | 'FEED'>('POSTS');
  const [viewingHighlight, setViewingHighlight] = useState<Highlight | null>(null);
  
  // Force update to reflect follow state changes
  const [_, setForceUpdate] = useState(0);

  if (!user) return <div>Usuário não encontrado</div>;

  const handleFollowToggle = () => {
      loopService.toggleFollow(user.id);
      setForceUpdate(prev => prev + 1);
  };

  const isLocked = user.isPrivate && !isFollowing;

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
        <HighlightViewer 
            highlight={viewingHighlight} 
            onClose={() => setViewingHighlight(null)} 
        />
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 -mt-0 md:-mt-6">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <ArrowLeft className="text-gray-900 dark:text-white" />
            </button>
            <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</span>
                <span className="text-xs text-gray-500">{posts.length} posts</span>
            </div>
        </div>

        <div className="p-4">
             <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-gray-400">
                          <img 
                            src={user.avatarUrl} 
                            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-950" 
                            alt="Profile" 
                          />
                      </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                                  {user.name}
                                  {user.isPrivate && <Lock size={16} className="text-gray-500" />}
                              </h1>
                              <p className="text-gray-500 font-medium text-base md:text-lg">{user.handle}</p>
                          </div>
                          
                          <button 
                            onClick={handleFollowToggle}
                            className={`w-full md:w-auto text-center px-6 py-2 rounded-full font-bold transition-colors ${
                                isFollowing 
                                ? 'border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900' 
                                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                            }`}
                          >
                            {isFollowing ? 'Seguindo' : 'Seguir'}
                          </button>
                      </div>

                      <div className="flex justify-around md:justify-start md:gap-6 text-sm text-gray-900 dark:text-gray-200 mb-4 border-b md:border-none border-gray-100 dark:border-gray-800 pb-4 md:pb-0">
                          <div className="flex flex-col md:block items-center"><span className="font-bold text-lg md:text-base block md:inline">{posts.length}</span> <span className="text-gray-500 dark:text-gray-400">posts</span></div>
                          <div className="flex flex-col md:block items-center"><span className="font-bold text-lg md:text-base block md:inline">{user.following.length}</span> <span className="text-gray-500 dark:text-gray-400">seguindo</span></div>
                          <div className="flex flex-col md:block items-center"><span className="font-bold text-lg md:text-base block md:inline">{user.followers.length}</span> <span className="text-gray-500 dark:text-gray-400">seguidores</span></div>
                      </div>

                      <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-w-lg mx-auto md:mx-0 text-sm md:text-base">
                        {user.bio}
                      </p>
                  </div>
             </div>

             {/* Highlights */}
             {user.highlights.length > 0 && (
                <div className="flex gap-4 overflow-x-auto mt-4 pb-4 scrollbar-hide">
                    {user.highlights.map(h => (
                        <div 
                            key={h.id} 
                            className="flex flex-col items-center gap-2 cursor-pointer min-w-[72px] group"
                            onClick={() => setViewingHighlight(h)}
                        >
                            <div className="w-16 h-16 rounded-full p-[1px] bg-gray-200 dark:bg-gray-800 group-hover:scale-105 transition-transform duration-200">
                                <img src={h.imageUrl} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-950" />
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white truncate w-20 text-center">{h.title}</span>
                        </div>
                    ))}
                </div>
             )}

             {isLocked ? (
                 <div className="py-20 text-center border-t border-gray-100 dark:border-gray-800 mt-6">
                     <div className="flex justify-center mb-4">
                         <div className="p-4 rounded-full border-2 border-gray-800 dark:border-gray-200">
                             <Lock size={32} className="text-gray-800 dark:text-gray-200" />
                         </div>
                     </div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">Esta conta é privada</h3>
                     <p className="text-gray-500">Siga esta conta para ver suas fotos e vídeos.</p>
                 </div>
             ) : (
                 <>
                    {/* Tabs */}
                    <div className="border-t border-gray-200 dark:border-gray-800 mt-2 sticky top-14 bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-md z-20">
                        <div className="flex justify-around md:justify-start md:gap-12">
                            <button 
                                onClick={() => setActiveProfileTab('POSTS')}
                                className={`py-3 md:py-4 flex-1 md:flex-none md:px-4 text-xs md:text-sm font-bold tracking-widest uppercase border-t-2 transition-colors ${activeProfileTab === 'POSTS' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Posts
                            </button>
                            <button 
                                onClick={() => setActiveProfileTab('REPOSTS')}
                                className={`py-3 md:py-4 flex-1 md:flex-none md:px-4 text-xs md:text-sm font-bold tracking-widest uppercase border-t-2 transition-colors flex items-center justify-center gap-2 ${activeProfileTab === 'REPOSTS' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                <Repeat size={14} /> Republicados
                            </button>
                            <button 
                                onClick={() => setActiveProfileTab('FEED')}
                                className={`py-3 md:py-4 flex-1 md:flex-none md:px-4 text-xs md:text-sm font-bold tracking-widest uppercase border-t-2 transition-colors ${activeProfileTab === 'FEED' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Feed
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="py-2">
                        {activeProfileTab === 'POSTS' && (
                            <div className="flex flex-col gap-4">
                                {posts.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">
                                        <h3 className="font-bold text-lg">Ainda sem posts</h3>
                                    </div>
                                ) : (
                                    posts.map(p => (
                                        <PostCard 
                                            key={p.id} 
                                            post={p} 
                                            author={user}
                                            onLikeToggle={onLikeToggle}
                                            onSaveToggle={onSaveToggle}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {activeProfileTab === 'REPOSTS' && (
                            <div className="flex flex-col gap-4 px-2 md:px-0">
                                {reposts.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">
                                        <div className="text-4xl mb-4">🔁</div>
                                        <h3 className="font-bold text-lg">Nenhum repost</h3>
                                    </div>
                                ) : (
                                    reposts.map(p => (
                                        <PostCard 
                                            key={p.id} 
                                            post={p} 
                                            author={loopService.getUserById(p.userId)}
                                            onLikeToggle={onLikeToggle}
                                            onSaveToggle={onSaveToggle}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {activeProfileTab === 'FEED' && (
                            <div className="grid grid-cols-3 gap-0.5 md:gap-4">
                                {posts.map(p => (
                                    <div key={p.id} className="aspect-square bg-gray-100 dark:bg-gray-900 relative group cursor-pointer overflow-hidden">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> 
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center p-4 text-xs text-left bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
                                                {p.content.substring(0,50)}...
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </>
             )}
        </div>
    </div>
  );
};