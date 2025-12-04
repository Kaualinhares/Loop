import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { X, ArrowLeft, Image as ImageIcon, Camera, Check, ChevronRight, MapPin, Search, User as UserIcon } from 'lucide-react';
import { loopService } from '../services/LoopDataService';
import { geminiService } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPostCreated: (content: string, imageUrl?: string, location?: string, taggedUsers?: string[]) => void;
}

// Simple CSS filters for "Editing"
const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'Vivid', class: 'brightness-110 contrast-125' },
  { name: 'B&W', class: 'grayscale' },
  { name: 'Sepia', class: 'sepia contrast-125' },
  { name: 'Warm', class: 'sepia-[.3] contrast-110 brightness-110' },
  { name: 'Cool', class: 'hue-rotate-15 contrast-110' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, currentUser, onPostCreated }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Select, 2: Edit, 3: Details
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-screens state
  const [activeSubScreen, setActiveSubScreen] = useState<'NONE' | 'LOCATION' | 'TAGGING'>('NONE');
  const [location, setLocation] = useState<string>('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  // Location Search State
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<string[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Mock "Device Gallery" for the UI sensation
  const MOCK_GALLERY = Array.from({ length: 12 }).map((_, i) => `https://picsum.photos/seed/gallery_${i}/400/400`);

  const handleReset = () => {
      setStep(1);
      setSelectedImage(null);
      setCaption('');
      setSelectedFilter(FILTERS[0]);
      setLocation('');
      setTaggedUsers([]);
      setActiveSubScreen('NONE');
      setLocationResults([]);
      setLocationQuery('');
      onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setSelectedImage(url);
          setStep(2);
      }
  };

  const handleMockSelect = (url: string) => {
      setSelectedImage(url);
      setStep(2);
  };

  const handleShare = () => {
      // In a real app, we would process the image with the filter here (canvas).
      onPostCreated(caption, selectedImage || undefined, location || undefined, taggedUsers);
      handleReset();
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!locationQuery.trim()) return;

      setIsSearchingLocation(true);
      try {
          const results = await geminiService.searchPlaces(locationQuery);
          setLocationResults(results);
      } catch (e) {
          setLocationResults([locationQuery]);
      } finally {
          setIsSearchingLocation(false);
      }
  };

  const toggleTagUser = (userId: string) => {
      if(taggedUsers.includes(userId)) {
          setTaggedUsers(prev => prev.filter(id => id !== userId));
      } else {
          setTaggedUsers(prev => [...prev, userId]);
      }
  };

  if (!isOpen) return null;

  // Render Sub-Screens
  if (activeSubScreen === 'LOCATION') {
      return (
          <div className="fixed inset-0 z-[80] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-right">
              <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 pt-10 md:pt-4">
                  <button onClick={() => setActiveSubScreen('NONE')}>
                      <ArrowLeft className="text-gray-900 dark:text-white" />
                  </button>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">Adicionar Localização</h2>
              </div>
              
              {/* Visual Map Placeholder */}
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 opacity-30" style={{ 
                      backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                  }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <MapPin size={48} className="text-red-500 drop-shadow-md" fill="currentColor" />
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">Google Maps</div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                  <form onSubmit={handleLocationSearch} className="relative mb-4">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                      <input 
                          type="text" 
                          autoFocus
                          value={locationQuery}
                          onChange={(e) => setLocationQuery(e.target.value)}
                          placeholder="Pesquisar locais..."
                          className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
                      />
                  </form>
                  
                  {isSearchingLocation && <div className="text-center p-4 text-gray-500">Buscando locais...</div>}

                  <div className="flex flex-col gap-2">
                      {locationResults.map((place, idx) => (
                          <button 
                            key={idx}
                            onClick={() => { setLocation(place); setActiveSubScreen('NONE'); }}
                            className="text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3 transition-colors"
                          >
                              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                  <MapPin size={18} />
                              </div>
                              <span className="text-gray-900 dark:text-white font-medium">{place}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  if (activeSubScreen === 'TAGGING') {
      const allUsers = loopService.getAllUsers();
      return (
          <div className="fixed inset-0 z-[80] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-right">
               <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 pt-10 md:pt-4">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setActiveSubScreen('NONE')}>
                          <ArrowLeft className="text-gray-900 dark:text-white" />
                      </button>
                      <h2 className="font-bold text-lg text-gray-900 dark:text-white">Marcar Pessoas</h2>
                  </div>
                  <button 
                      onClick={() => setActiveSubScreen('NONE')}
                      className="text-cyan-600 font-bold"
                  >
                      Concluir
                  </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                  <div className="relative mb-4">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                      <input 
                          type="text" 
                          placeholder="Pesquisar pessoas..."
                          className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
                      />
                  </div>
                  <div className="flex flex-col gap-2 pb-10">
                      {allUsers.map(user => {
                          const isSelected = taggedUsers.includes(user.id);
                          return (
                              <button 
                                key={user.id}
                                onClick={() => toggleTagUser(user.id)}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                  <div className="flex items-center gap-3">
                                      <img src={user.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
                                      <div className="text-left">
                                          <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                          <div className="text-sm text-gray-500">{user.handle}</div>
                                      </div>
                                  </div>
                                  {isSelected && (
                                      <div className="text-cyan-600">
                                          <Check size={24} />
                                      </div>
                                  )}
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      {/* Container: Full screen on mobile, Modal on desktop */}
      <div className="bg-white dark:bg-gray-900 w-full md:max-w-4xl h-[100dvh] md:h-[80vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Header (Mobile only) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 pt-10 pb-3 z-10 bg-white dark:bg-gray-900 shrink-0">
            <button onClick={step === 1 ? onClose : () => setStep(prev => (prev - 1) as any)}>
                {step === 1 ? <X /> : <ArrowLeft />}
            </button>
            <span className="font-bold text-lg">
                {step === 1 ? 'Nova publicação' : step === 2 ? 'Editar' : 'Nova publicação'}
            </span>
            <button 
                onClick={step === 3 ? handleShare : () => setStep(prev => (prev + 1) as any)}
                className="text-cyan-600 font-bold"
                disabled={!selectedImage && step !== 1} // Can't proceed without image
            >
                {step === 3 ? 'Compartilhar' : 'Avançar'}
            </button>
        </div>

        {/* Left Side: Image Preview / Canvas */}
        <div className={`flex-1 bg-gray-100 dark:bg-black relative flex items-center justify-center overflow-hidden ${step === 1 ? 'hidden md:flex' : ''} ${step === 2 ? 'h-[50vh] md:h-full' : ''} ${step === 3 ? 'h-[30vh] md:h-full border-b md:border-b-0 border-gray-200 dark:border-gray-800' : ''}`}>
             {selectedImage ? (
                 <img 
                    src={selectedImage} 
                    className={`max-h-full max-w-full object-contain transition-all duration-300 ${selectedFilter.class}`}
                    alt="Selected" 
                 />
             ) : (
                 <div className="text-gray-400 flex flex-col items-center">
                     <ImageIcon size={64} className="mb-4 opacity-50" />
                     <p>Selecione uma foto para começar</p>
                 </div>
             )}
             
             {/* Tagged users overlay indicator */}
             {step === 3 && taggedUsers.length > 0 && (
                 <div className="absolute bottom-4 left-4 flex -space-x-2">
                     {taggedUsers.map(id => {
                         const u = loopService.getUserById(id);
                         return u ? <img key={id} src={u.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white" /> : null
                     })}
                 </div>
             )}
        </div>

        {/* Right Side: Controls */}
        <div className={`flex flex-col bg-white dark:bg-gray-900 ${step === 1 ? 'w-full h-full' : 'flex-1 md:flex-none md:w-[350px] border-l border-gray-100 dark:border-gray-800'}`}>
            
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <button onClick={step === 1 ? onClose : () => setStep(prev => (prev - 1) as any)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    {step === 1 ? 'Cancelar' : <ArrowLeft />}
                </button>
                <span className="font-bold">
                    {step === 1 ? 'Nova publicação' : step === 2 ? 'Editar' : 'Detalhes'}
                </span>
                {step === 1 ? (
                   <div />
                ) : (
                    <button 
                        onClick={step === 3 ? handleShare : () => setStep(prev => (prev + 1) as any)}
                        className="text-cyan-600 font-bold hover:text-cyan-700"
                    >
                        {step === 3 ? 'Compartilhar' : 'Avançar'}
                    </button>
                )}
            </div>

            {/* STEP 1: GALLERY SELECTION */}
            {step === 1 && (
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 grid grid-cols-3 gap-1">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                        >
                            <Camera size={32} className="text-gray-500" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            accept="image/*,video/*" 
                            className="hidden" 
                        />
                        {/* Mock Gallery Items */}
                        {MOCK_GALLERY.map((src, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleMockSelect(src)}
                                className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
                            >
                                <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: FILTERS */}
            {step === 2 && (
                <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase text-center md:text-left">Filtros</h3>
                    <div className="grid grid-cols-4 md:grid-cols-3 gap-4 pb-20 md:pb-0">
                        {FILTERS.map(filter => (
                            <div 
                                key={filter.name}
                                onClick={() => setSelectedFilter(filter)}
                                className="flex flex-col items-center gap-2 cursor-pointer group"
                            >
                                <div className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedFilter.name === filter.name ? 'border-cyan-500 scale-105' : 'border-transparent group-hover:border-gray-300'}`}>
                                    <img 
                                        src={selectedImage || ''} 
                                        className={`w-full h-full object-cover ${filter.class}`} 
                                    />
                                </div>
                                <span className={`text-xs font-medium ${selectedFilter.name === filter.name ? 'text-cyan-600' : 'text-gray-500'}`}>
                                    {filter.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
                <div className="flex-1 overflow-y-auto p-4">
                     <div className="flex gap-3 mb-4">
                         <img src={currentUser.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
                         <span className="font-bold text-gray-900 dark:text-white mt-2">{currentUser.name}</span>
                     </div>
                     <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Escreva uma legenda..."
                        className="w-full h-24 md:h-32 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white resize-none text-base"
                     />
                     <div className="border-t border-gray-100 dark:border-gray-800 py-3">
                         <div 
                            onClick={() => setActiveSubScreen('LOCATION')}
                            className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded-lg transition-colors"
                         >
                             <div className="flex items-center gap-2">
                                 <span className="text-gray-900 dark:text-white">Adicionar Localização</span>
                                 {location && <span className="text-sm text-cyan-600 font-medium bg-cyan-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded-full">{location}</span>}
                             </div>
                             <ChevronRight className="text-gray-400" size={20} />
                         </div>
                         <div 
                            onClick={() => setActiveSubScreen('TAGGING')}
                            className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 -mx-2 rounded-lg transition-colors"
                         >
                             <div className="flex items-center gap-2">
                                <span className="text-gray-900 dark:text-white">Marcar Pessoas</span>
                                {taggedUsers.length > 0 && <span className="text-sm text-gray-500">({taggedUsers.length})</span>}
                             </div>
                             <ChevronRight className="text-gray-400" size={20} />
                         </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};