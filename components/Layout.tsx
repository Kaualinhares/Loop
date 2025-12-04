import React, { useState } from 'react';
import { Logo } from './Logo';
import { Home, Compass, Bell, User as UserIcon, LogOut, Settings, MessageCircle, PlusSquare, Plus } from 'lucide-react';
import { NavigationTab, User } from '../types';
import { loopService } from '../services/LoopDataService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currentUser: User;
  isDarkMode: boolean;
  onLogout: () => void;
  onCreateClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, currentUser, isDarkMode, onLogout, onCreateClick }) => {
  const [suggestionState, setSuggestionState] = useState(0); 

  const NavItem = ({ tab, icon: Icon, label, onClick }: { tab?: NavigationTab, icon: any, label: string, onClick?: () => void }) => {
    const isActive = activeTab === tab && !onClick;
    return (
      <button
        onClick={onClick ? onClick : () => onTabChange(tab!)}
        className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-lg transition-all duration-300 w-full group relative overflow-hidden
          ${isActive 
            ? 'font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-cyan-600 dark:hover:text-cyan-400'
          }`}
      >
        <div className="relative z-10 flex items-center gap-4">
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="hidden xl:inline">{label}</span>
        </div>
      </button>
    );
  };

  const handleFollowToggle = (id: string) => {
      loopService.toggleFollow(id);
      setSuggestionState(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0f1117]' : 'bg-[#f8fafc]'}`}>
      
      {/* Central Layout Container */}
      <div className="max-w-[1400px] mx-auto min-h-screen flex text-gray-900 dark:text-gray-100">
        
        {/* --- Left Sidebar (Desktop) --- */}
        <aside className="hidden md:flex flex-col w-20 xl:w-72 sticky top-0 h-screen border-r border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-[#0f1117]/70 backdrop-blur-xl z-20 px-3 xl:px-6 py-6 justify-between transition-colors shrink-0">
          <div className="flex flex-col gap-8">
            <div className="pl-3 xl:pl-4 py-2">
              {/* Show Text only on XL screens if desired, or false to always hide text as requested */}
              <Logo size={40} className="xl:flex" showText={false} />
            </div>
            
            <nav className="flex flex-col gap-2">
              <NavItem tab={NavigationTab.HOME} icon={Home} label="Início" />
              <NavItem tab={NavigationTab.EXPLORE} icon={Compass} label="Explorar" />
              <NavItem tab={NavigationTab.MESSAGES} icon={MessageCircle} label="Mensagens" />
              <NavItem tab={NavigationTab.NOTIFICATIONS} icon={Bell} label="Notificações" />
              <NavItem icon={PlusSquare} label="Criar" onClick={onCreateClick} />
              {/* Profile Item removed from here to keep only the bottom one */}
              <NavItem tab={NavigationTab.SETTINGS} icon={Settings} label="Configurações" />
            </nav>
          </div>

          <div 
            onClick={() => onTabChange(NavigationTab.PROFILE)}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer transition-colors mb-4 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
              <img src={currentUser.avatarUrl} alt="Me" className="w-11 h-11 rounded-full object-cover border-2 border-transparent group-hover:border-cyan-500 transition-all shadow-sm" />
              <div className="hidden xl:block overflow-hidden flex-1">
                  <p className="font-bold text-sm truncate text-gray-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{currentUser.handle}</p>
              </div>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                }}
                className="ml-auto text-gray-400 hover:text-red-500 hidden xl:block transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1 w-full max-w-[640px] border-r border-gray-200/60 dark:border-gray-800/60 min-h-screen pb-24 md:pb-0 transition-colors bg-white dark:bg-[#0f1117]">
           {/* Mobile Header */}
           <div className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 p-3 px-4 flex justify-between items-center transition-colors shadow-sm h-14">
               {/* Spacer to balance layout since avatar was removed */}
               <div className="w-8"></div>
               
               <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Logo size={32} showText={false} />
               </div>
               <button onClick={() => onTabChange(NavigationTab.SETTINGS)} className="p-1">
                  <Settings className="text-gray-600 dark:text-gray-400" size={24} />
               </button>
           </div>

           <div className="p-0 md:p-6">
              {children}
           </div>
        </main>

        {/* --- Right Sidebar (Suggestions) --- */}
        <aside className="hidden lg:block w-[380px] sticky top-0 h-screen p-8 overflow-y-auto shrink-0 z-10 transition-colors bg-[#f8fafc] dark:bg-[#0f1117]">
          
          <div className="mb-8 sticky top-0 bg-[#f8fafc] dark:bg-[#0f1117] pb-4 z-10 pt-2">
             <input 
                type="text" 
                placeholder="Buscar no Loop" 
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-3.5 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 shadow-sm transition-shadow"
             />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-xl">Quem seguir</h3>
              {loopService.getAllUsers().slice(0, 3).map((user) => {
                  const isFollowing = loopService.isFollowing(user.id);
                  return (
                    <div key={user.id} className="flex items-center justify-between mb-5 last:mb-0 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3" onClick={() => onTabChange(NavigationTab.EXPLORE)}>
                            <img src={user.avatarUrl} className="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-gray-700" alt={user.name}/>
                            <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-cyan-600 transition-colors">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.handle}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleFollowToggle(user.id)}
                            className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all transform active:scale-95 ${
                                isFollowing 
                                ? 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                            }`}
                        >
                            {isFollowing ? 'Seguindo' : 'Seguir'}
                        </button>
                    </div>
                  );
              })}
              <button className="text-cyan-600 text-sm mt-4 font-semibold hover:underline">Mostrar mais</button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-xl">O que está acontecendo</h3>
             {[1, 2, 3].map((_, i) => (
                <div key={i} className="mb-5 last:mb-0 p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1 flex justify-between">
                        <span>Tecnologia</span>
                        <span className="text-gray-400">···</span>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">Loop 2.0 Lançamento</div>
                    <div className="text-xs text-gray-500 mt-1">54.2k Posts</div>
                </div>
             ))}
          </div>
          
          <div className="mt-8 px-4 text-xs text-gray-400 leading-6 flex flex-wrap gap-x-4">
              <a href="#" className="hover:underline">Termos</a>
              <a href="#" className="hover:underline">Privacidade</a>
              <a href="#" className="hover:underline">Cookies</a>
              <a href="#" className="hover:underline">Acessibilidade</a>
              <span>© 2025 Loop Social</span>
          </div>
        </aside>

        {/* --- Mobile Bottom Navigation --- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex justify-around items-end py-2 px-2 z-50 pb-5 transition-colors shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={() => onTabChange(NavigationTab.HOME)} className={`p-3 rounded-full transition-colors active:scale-90 duration-200 ${activeTab === NavigationTab.HOME ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              <Home size={26} strokeWidth={activeTab === NavigationTab.HOME ? 2.5 : 2} />
          </button>
          
          <button onClick={() => onTabChange(NavigationTab.EXPLORE)} className={`p-3 rounded-full transition-colors active:scale-90 duration-200 ${activeTab === NavigationTab.EXPLORE ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              <Compass size={26} strokeWidth={activeTab === NavigationTab.EXPLORE ? 2.5 : 2} />
          </button>
          
          <button onClick={onCreateClick} className="p-2 -mb-5 relative top-[-10px]">
              <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 text-white rounded-2xl p-3.5 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all">
                  <Plus size={28} strokeWidth={3} />
              </div>
          </button>

          <button onClick={() => onTabChange(NavigationTab.MESSAGES)} className={`p-3 rounded-full transition-colors active:scale-90 duration-200 ${activeTab === NavigationTab.MESSAGES ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              <MessageCircle size={26} strokeWidth={activeTab === NavigationTab.MESSAGES ? 2.5 : 2} />
          </button>
          
          <button onClick={() => onTabChange(NavigationTab.PROFILE)} className={`p-3 rounded-full transition-colors active:scale-90 duration-200 ${activeTab === NavigationTab.PROFILE ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              <UserIcon size={26} strokeWidth={activeTab === NavigationTab.PROFILE ? 2.5 : 2} />
          </button>
        </nav>
      </div>
    </div>
  );
};