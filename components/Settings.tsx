import React, { useState } from 'react';
import { 
  Moon, Sun, Lock, Shield, Languages, Eye, 
  Smartphone, Bookmark, Hash, AtSign, ChevronRight,
  ToggleLeft, ToggleRight,
  ArrowLeft, Check
} from 'lucide-react';
import { NavigationTab, User, Post } from '../types';
import { loopService } from '../services/LoopDataService';
import { PostCard } from './PostCard';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  currentUser: User;
  onUpdateUser: () => void;
}

const SUPPORTED_LANGUAGES = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'jp', name: '日本語' },
    { code: 'cn', name: '简体中文' },
];

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleDarkMode, onBack, currentUser, onUpdateUser }) => {
  const [activeSubView, setActiveSubView] = useState<'MAIN' | 'SAVED' | 'LANGUAGES'>('MAIN');
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

  const handlePrivacyToggle = () => {
      loopService.updateProfile({ isPrivate: !currentUser.isPrivate });
      onUpdateUser();
  };

  const handleOpenSaved = () => {
      setSavedPosts(loopService.getSavedPosts());
      setActiveSubView('SAVED');
  };

  const handleLikeToggle = (postId: string) => {
      loopService.toggleLike(postId);
      setSavedPosts(loopService.getSavedPosts()); // Refresh current view
  };
  
  const handleSaveToggle = (postId: string) => {
      loopService.toggleSave(postId);
      setSavedPosts(loopService.getSavedPosts()); // Refresh current view
  };

  const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">{title}</h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
        {children}
      </div>
    </div>
  );

  const Item = ({ icon: Icon, label, value, onClick, isToggle = false, toggleValue }: any) => (
    <div 
        onClick={onClick}
        className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
             <Icon size={20} />
        </div>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{label}</span>
      </div>
      
      {isToggle ? (
        <button className={`text-2xl transition-colors ${toggleValue ? 'text-cyan-500' : 'text-gray-300 dark:text-gray-600'}`}>
            {toggleValue ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
           {value && <span className="text-sm">{value}</span>}
           <ChevronRight size={18} />
        </div>
      )}
    </div>
  );

  // Sub-View: Saved Posts
  if (activeSubView === 'SAVED') {
      return (
          <div className="animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-3 mb-6 p-4 md:p-0 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-10">
                  <button onClick={() => setActiveSubView('MAIN')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                      <ArrowLeft className="text-gray-800 dark:text-gray-200" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Itens Salvos</h2>
              </div>
              <div className="flex flex-col gap-2 pb-10">
                  {savedPosts.length === 0 ? (
                      <div className="text-center text-gray-500 py-10">Você ainda não salvou nenhum loop.</div>
                  ) : (
                      savedPosts.map(post => (
                          <PostCard 
                            key={post.id} 
                            post={post} 
                            author={loopService.getUserById(post.userId)}
                            onLikeToggle={handleLikeToggle}
                            onSaveToggle={handleSaveToggle}
                          />
                      ))
                  )}
              </div>
          </div>
      );
  }

  // Sub-View: Languages
  if (activeSubView === 'LANGUAGES') {
    return (
        <div className="animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6 p-4 md:p-0 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-10">
                <button onClick={() => setActiveSubView('MAIN')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ArrowLeft className="text-gray-800 dark:text-gray-200" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Idiomas</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm mx-4 md:mx-0">
                {SUPPORTED_LANGUAGES.map(lang => (
                    <div 
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang.code)}
                        className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                        <span className={`font-medium ${currentLanguage === lang.code ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {lang.name}
                        </span>
                        {currentLanguage === lang.code && (
                            <Check className="text-cyan-600 dark:text-cyan-400" size={20} />
                        )}
                    </div>
                ))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm p-4 text-center mt-4">
                Isso alterará o idioma da interface do aplicativo.
            </p>
        </div>
    );
  }

  // Main Settings View
  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 mb-6">
         <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-800 dark:text-gray-200" />
         </button>
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h2>
      </div>

      <Section title="Aparência">
         <Item 
            icon={isDarkMode ? Moon : Sun} 
            label="Modo Escuro" 
            isToggle={true} 
            toggleValue={isDarkMode} 
            onClick={onToggleDarkMode} 
         />
      </Section>

      <Section title="Conta & Privacidade">
         <Item 
            icon={Lock} 
            label="Privacidade da Conta" 
            isToggle={true}
            toggleValue={currentUser.isPrivate}
            onClick={handlePrivacyToggle}
         />
         <Item icon={Shield} label="Contas Bloqueadas" value="3" />
         <Item icon={Eye} label="Quem pode ver seus stories" />
      </Section>

      <Section title="Interações">
         <Item icon={Bookmark} label="Itens Salvos" onClick={handleOpenSaved} />
         <Item icon={Hash} label="Comentários" value="Todos" />
         <Item icon={AtSign} label="Marcações e Menções" />
      </Section>

      <Section title="Preferências">
         <Item 
            icon={Languages} 
            label="Idiomas e Tradução" 
            value={SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.name} 
            onClick={() => setActiveSubView('LANGUAGES')}
         />
         <Item icon={Smartphone} label="Permissões do Dispositivo" />
         <Item icon={Eye} label="Acessibilidade" />
      </Section>

      <div className="text-center py-6">
         <button className="text-red-500 font-medium hover:underline">Sair da conta</button>
         <p className="text-xs text-gray-400 mt-2">Versão 1.5.0 (Loop Beta)</p>
      </div>
    </div>
  );
};