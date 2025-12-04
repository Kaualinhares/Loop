import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { CreatePostModal } from './components/CreatePostModal';
import { PostCard } from './components/PostCard';
import { StoryRail } from './components/StoryRail';
import { Settings } from './components/Settings';
import { ChatInterface } from './components/ChatInterface';
import { EditProfileModal } from './components/EditProfileModal';
import { HighlightViewer } from './components/HighlightViewer';
import { UserProfileView } from './components/UserProfileView';
import { CreateStoryModal } from './components/CreateStoryModal'; // Import
import { StoryViewer } from './components/StoryViewer'; // Import
import { loopService } from './services/LoopDataService';
import { Post, NavigationTab, Story, User, Highlight } from './types';
import { Plus, Search, Lock, Repeat } from 'lucide-react';

function App() {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.HOME);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentUser, setCurrentUser] = useState(loopService.getCurrentUser());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Profile View State
  const [activeProfileTab, setActiveProfileTab] = useState<'POSTS' | 'REPOSTS' | 'FEED'>('POSTS');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [viewingHighlight, setViewingHighlight] = useState<Highlight | null>(null);

  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // External User Profile View State
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // Story States
  const [storyFile, setStoryFile] = useState<File | null>(null); // For creating
  const [viewingStory, setViewingStory] = useState<Story | null>(null); // For viewing

  // Initial Data Load
  const refreshData = () => {
    setPosts(loopService.getAllPosts());
    setStories(loopService.getAllStories());
    setCurrentUser(loopService.getCurrentUser());
  };

  useEffect(() => {
    if (isLoggedIn) {
        // Check for temp registration data (This is critical for new users starting with 0 stats)
        const tempHandle = localStorage.getItem('temp_reg_handle');
        const tempName = localStorage.getItem('temp_reg_name');
        
        if (tempHandle && tempName) {
            // It's a new user! Reset the current user state to a fresh profile.
            loopService.createNewUser(tempName, tempHandle);
            
            // Clean up flags
            localStorage.removeItem('temp_reg_handle');
            localStorage.removeItem('temp_reg_name');
        }
        
        refreshData();
    }
  }, [isLoggedIn]);

  // Handlers
  const handleLogin = () => {
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setActiveTab(NavigationTab.HOME);
  };

  const handlePostCreated = (content: string, imageUrl?: string, location?: string, taggedUsers?: string[]) => {
    loopService.createPost(content, imageUrl, location, taggedUsers);
    refreshData();
    setIsCreateModalOpen(false);
  };

  const handleLikeToggle = (postId: string) => {
    loopService.toggleLike(postId);
    refreshData();
  };

  const handleSaveToggle = (postId: string) => {
      loopService.toggleSave(postId);
      refreshData();
  }

  const handleUpdateProfile = (updates: Partial<User>) => {
      loopService.updateProfile(updates);
      refreshData();
  }

  const handleAddHighlight = () => {
      const title = prompt("Nome do Destaque:");
      if (title) {
          loopService.addHighlight(title, `https://picsum.photos/seed/${Math.random()}/400/800`);
          refreshData();
      }
  }

  const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
  }

  const handleUserClick = (userId: string) => {
      if (userId === currentUser.id) {
          setActiveTab(NavigationTab.PROFILE);
      } else {
          setViewingProfileId(userId);
      }
  };

  const handleExploreClick = (userId: string) => {
      setViewingProfileId(userId);
  };

  if (!isLoggedIn) {
      return (
          <div className={isDarkMode ? 'dark' : ''}>
             <LoginPage onLogin={handleLogin} />
          </div>
      );
  }

  // If viewing an external profile, override the main content area
  const renderContent = () => {
      if (viewingProfileId) {
          return (
              <UserProfileView 
                 userId={viewingProfileId} 
                 onBack={() => setViewingProfileId(null)}
                 onLikeToggle={handleLikeToggle}
                 onSaveToggle={handleSaveToggle}
              />
          );
      }

      switch (activeTab) {
        case NavigationTab.HOME:
            return (
                <div className="animate-in fade-in duration-500">
                    {/* Feed Header (Hidden on Mobile, Sticky on Desktop) */}
                    <div className="hidden md:block mb-8 sticky top-0 z-10 py-4 -mt-6 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Página Inicial</h2>
                    </div>
                    
                    {/* Stories */}
                    <div className="mb-4 md:mb-8 pt-4 md:pt-0">
                        <StoryRail 
                            stories={stories} 
                            currentUser={currentUser} 
                            onAddStoryStart={(file) => setStoryFile(file)}
                            onViewStory={(story) => setViewingStory(story)}
                        />
                    </div>

                    {/* Feed */}
                    <div className="flex flex-col gap-4 px-2 md:px-0">
                        {posts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            author={loopService.getUserById(post.userId)}
                            onLikeToggle={handleLikeToggle}
                            onSaveToggle={handleSaveToggle}
                            onUserClick={handleUserClick}
                        />
                        ))}
                    </div>
                    
                    <div className="py-12 text-center text-gray-400 text-sm font-medium">
                        Você chegou ao fim dos loops por enquanto! 🌀
                    </div>
                </div>
            );

        case NavigationTab.EXPLORE:
            const explorePosts = loopService.getExplorePosts();
            return (
                <div className="animate-in fade-in duration-300">
                     <div className="sticky top-0 z-30 p-4 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 mb-2 md:mb-6 -mt-0 md:-mt-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Buscar no Loop" 
                                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 placeholder-gray-400 shadow-sm"
                            />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 px-2 md:px-0 pb-20">
                         {explorePosts.map(post => (
                             <PostCard 
                                key={post.id} 
                                post={post} 
                                author={loopService.getUserById(post.userId)}
                                onLikeToggle={handleLikeToggle}
                                onSaveToggle={handleSaveToggle}
                                onUserClick={handleExploreClick}
                             />
                         ))}
                     </div>
                </div>
            );

        case NavigationTab.MESSAGES:
            return <ChatInterface currentUser={currentUser} />;

        case NavigationTab.NOTIFICATIONS:
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 animate-in slide-in-from-bottom-4">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">🔔</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Notificações</h2>
                    <p>Tudo tranquilo por aqui.</p>
                </div>
            );

        case NavigationTab.PROFILE:
            // Fetch logic inside render
            const myPosts = loopService.getPostsByUser(currentUser.id);
            const myReposts = loopService.getRepostsByUser(currentUser.id);

            return (
                <div className="animate-in slide-in-from-bottom-4 pb-20">
                    <EditProfileModal 
                        user={currentUser} 
                        isOpen={isEditProfileOpen} 
                        onClose={() => setIsEditProfileOpen(false)}
                        onSave={handleUpdateProfile}
                    />

                    {/* New Minimal Header Layout */}
                    <div className="px-4 pt-4 md:pt-8 mb-4 md:mb-8">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                            {/* Avatar */}
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-xl">
                                    <div className="w-full h-full bg-white dark:bg-[#0f1117] rounded-full p-[3px]">
                                        <img 
                                            src={currentUser.avatarUrl} 
                                            className="w-full h-full rounded-full object-cover" 
                                            alt="Profile" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2 tracking-tight">
                                            {currentUser.name}
                                            {currentUser.isPrivate && <Lock size={20} className="text-gray-400" />}
                                        </h1>
                                        <p className="text-gray-500 font-medium text-base md:text-lg">{currentUser.handle}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setIsEditProfileOpen(true)}
                                        className="mx-auto md:mx-0 w-full md:w-auto text-center border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm text-sm md:text-base"
                                    >
                                        Editar Perfil
                                    </button>
                                </div>

                                {/* Stats - Responsive Spacing */}
                                <div className="flex justify-around md:justify-start md:gap-8 text-sm md:text-base text-gray-900 dark:text-gray-200 mb-6 border-b md:border-none border-gray-100 dark:border-gray-800 pb-4 md:pb-0">
                                    <div className="cursor-pointer hover:opacity-70 transition-opacity flex flex-col md:block items-center">
                                        <span className="font-bold block text-lg md:text-xl">{myPosts.length}</span> 
                                        <span className="text-gray-500 dark:text-gray-400">posts</span>
                                    </div>
                                    <div className="cursor-pointer hover:opacity-70 transition-opacity flex flex-col md:block items-center">
                                        <span className="font-bold block text-lg md:text-xl">{currentUser.following.length}</span> 
                                        <span className="text-gray-500 dark:text-gray-400">seguindo</span>
                                    </div>
                                    <div className="cursor-pointer hover:opacity-70 transition-opacity flex flex-col md:block items-center">
                                        <span className="font-bold block text-lg md:text-xl">{currentUser.followers.length}</span> 
                                        <span className="text-gray-500 dark:text-gray-400">seguidores</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-w-xl mx-auto md:mx-0 text-sm md:text-base">
                                    {currentUser.bio || "Sem biografia."}
                                </p>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="flex gap-4 overflow-x-auto mt-6 md:mt-10 pb-4 scrollbar-hide">
                            <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[72px]" onClick={handleAddHighlight}>
                                <div className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900">
                                    <Plus size={24} className="text-gray-400" />
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white mt-1">Novo</span>
                            </div>
                            
                            {currentUser.highlights.map(h => (
                                <div 
                                    key={h.id} 
                                    className="flex flex-col items-center gap-2 cursor-pointer min-w-[72px] group"
                                    onClick={() => setViewingHighlight(h)}
                                >
                                    <div className="w-16 h-16 rounded-full p-[2px] bg-gray-200 dark:bg-gray-800 group-hover:scale-105 transition-transform duration-200">
                                        <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-[#0f1117]">
                                            <img src={h.imageUrl} className="w-full h-full rounded-full object-cover" />
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white truncate w-20 text-center">{h.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Profile Tabs */}
                    <div className="border-t border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-md">
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

                    {/* Profile Content */}
                    <div className="py-2">
                        {activeProfileTab === 'POSTS' && (
                            <div className="flex flex-col gap-4 px-2 md:px-0">
                                {myPosts.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">
                                        <div className="text-4xl mb-4">📸</div>
                                        <h3 className="font-bold text-lg">Ainda sem posts</h3>
                                        <p>Suas publicações aparecerão aqui.</p>
                                    </div>
                                ) : (
                                    myPosts.map(p => (
                                        <PostCard 
                                            key={p.id} 
                                            post={p} 
                                            author={loopService.getUserById(p.userId)}
                                            onLikeToggle={handleLikeToggle}
                                            onSaveToggle={handleSaveToggle}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {activeProfileTab === 'REPOSTS' && (
                            <div className="flex flex-col gap-4 px-2 md:px-0">
                                {myReposts.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">
                                        <div className="text-4xl mb-4">🔁</div>
                                        <h3 className="font-bold text-lg">Nenhum repost</h3>
                                        <p>O conteúdo que você republicar aparecerá aqui.</p>
                                    </div>
                                ) : (
                                    myReposts.map(p => (
                                        <PostCard 
                                            key={p.id} 
                                            post={p} 
                                            author={loopService.getUserById(p.userId)}
                                            onLikeToggle={handleLikeToggle}
                                            onSaveToggle={handleSaveToggle}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {activeProfileTab === 'FEED' && (
                            <div className="grid grid-cols-3 gap-0.5 md:gap-4">
                                {myPosts.map(p => (
                                    <div key={p.id} className="aspect-square bg-gray-100 dark:bg-gray-900 relative group cursor-pointer overflow-hidden">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> 
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center p-4 text-xs text-left bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
                                                {p.content.substring(0,50)}...
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex flex-col items-center justify-center text-white font-bold gap-1 animate-in fade-in duration-200">
                                            <span>{p.likes} ❤️</span>
                                            <span className="text-xs">{p.comments.length} 💬</span>
                                        </div>
                                    </div>
                                ))}
                                {myPosts.length === 0 && (
                                    <div className="col-span-3 text-center py-20 text-gray-500">
                                        Nenhum conteúdo no feed ainda.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );

        case NavigationTab.SETTINGS:
            return (
                <Settings 
                    isDarkMode={isDarkMode} 
                    onToggleDarkMode={toggleDarkMode}
                    onBack={() => setActiveTab(NavigationTab.HOME)} 
                    currentUser={currentUser}
                    onUpdateUser={refreshData}
                />
            );
        default:
            return null;
      }
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={(tab) => {
          setActiveTab(tab);
          setViewingProfileId(null); 
      }}
      currentUser={currentUser}
      isDarkMode={isDarkMode}
      onLogout={handleLogout}
      onCreateClick={() => setIsCreateModalOpen(true)}
    >
      <HighlightViewer 
        highlight={viewingHighlight} 
        onClose={() => setViewingHighlight(null)} 
      />
      
      {/* Story Viewer (For watching) */}
      <StoryViewer 
        initialStory={viewingStory}
        onClose={() => setViewingStory(null)}
      />

      {/* Create Story Modal (For posting) */}
      <CreateStoryModal 
         file={storyFile}
         onClose={() => setStoryFile(null)}
         onPosted={refreshData}
      />

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
      />

      {renderContent()}

    </Layout>
  );
}

export default App;