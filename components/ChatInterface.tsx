import React, { useState, useEffect } from 'react';
import { User, Message } from '../types';
import { loopService } from '../services/LoopDataService';
import { Send, Search, ArrowLeft } from 'lucide-react';

interface ChatInterfaceProps {
  currentUser: User;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users to chat with (excluding self)
    setAvailableUsers(loopService.getAllUsers());
  }, []);

  useEffect(() => {
    if (selectedUser) {
        setChatHistory(loopService.getMessagesForChat(selectedUser.id));
        // Simple polling simulation
        const interval = setInterval(() => {
            setChatHistory(loopService.getMessagesForChat(selectedUser.id));
        }, 3000);
        return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageText.trim() || !selectedUser) return;

      loopService.sendMessage(selectedUser.id, messageText);
      setChatHistory(loopService.getMessagesForChat(selectedUser.id));
      setMessageText('');
  };

  return (
    <div className="flex h-[calc(100dvh-70px)] md:h-[calc(100vh-40px)] bg-white dark:bg-gray-900 md:rounded-2xl overflow-hidden border-t md:border border-gray-200 dark:border-gray-800 animate-in fade-in -mx-6 -mt-6 md:mx-0 md:mt-0">
       {/* Sidebar / List */}
       <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-gray-200 dark:border-gray-800`}>
           <div className="p-4 border-b border-gray-200 dark:border-gray-800 pt-6 md:pt-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mensagens</h2>
               <div className="relative">
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                   <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                   />
               </div>
           </div>
           <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
               {availableUsers.map(user => (
                   <div 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedUser?.id === user.id ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}
                   >
                       <div className="relative">
                           <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                       </div>
                       <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Clique para conversar</p>
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* Chat Area */}
       <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-auto flex-col flex-1 bg-gray-50 dark:bg-gray-950`}>
           {selectedUser ? (
               <>
                   <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 pt-6 md:pt-4 sticky top-0 z-10">
                       <button onClick={() => setSelectedUser(null)} className="md:hidden text-gray-600 dark:text-gray-300">
                           <ArrowLeft size={24} />
                       </button>
                       <img src={selectedUser.avatarUrl} className="w-10 h-10 rounded-full" alt="avatar" />
                       <div>
                           <h3 className="font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                           <span className="text-xs text-green-500 font-medium">Online</span>
                       </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4">
                       {chatHistory.length === 0 && (
                           <div className="h-full flex flex-col items-center justify-center text-gray-400">
                               <p>Diga oi para {selectedUser.name}! 👋</p>
                           </div>
                       )}
                       {chatHistory.map(msg => {
                           const isMe = msg.senderId === currentUser.id;
                           return (
                               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                   <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                                       isMe 
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                                   }`}>
                                       {msg.text}
                                   </div>
                               </div>
                           );
                       })}
                   </div>

                   <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 fixed md:relative bottom-16 md:bottom-0 left-0 right-0 md:w-auto">
                       <form onSubmit={handleSendMessage} className="flex gap-2">
                           <input 
                              type="text" 
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              placeholder="Digite sua mensagem..."
                              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-full px-4 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                           />
                           <button 
                              type="submit" 
                              disabled={!messageText.trim()}
                              className="p-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                           >
                               <Send size={20} />
                           </button>
                       </form>
                   </div>
               </>
           ) : (
               <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-400">
                   <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                       <Send size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Suas Mensagens</h3>
                   <p>Selecione uma conversa para começar.</p>
               </div>
           )}
       </div>
    </div>
  );
};