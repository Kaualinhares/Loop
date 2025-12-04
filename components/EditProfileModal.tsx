import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { X, Camera, ZoomIn, Check, ArrowLeft, Move } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  
  // Cropping State
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reference for the hidden file input and image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
     if(isOpen) {
         // Reset form on open
         setName(user.name);
         setHandle(user.handle);
         setBio(user.bio || '');
         setAvatarUrl(user.avatarUrl);
         setEditingImage(null);
     }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ name, handle, bio, avatarUrl });
      onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const objectUrl = URL.createObjectURL(file);
          setEditingImage(objectUrl);
          // Reset crop state
          setScale(1);
          setPosition({ x: 0, y: 0 });
      }
      // Reset input value to allow re-selecting same file
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  };

  // --- Dragging Logic ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      setPosition({
          x: clientX - dragStart.x,
          y: clientY - dragStart.y
      });
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  // --- Crop Generation ---
  const generateCroppedImage = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!ctx || !img) return;

      // Set resolution (500x500 is good for avatars)
      const size = 500;
      canvas.width = size;
      canvas.height = size;

      // Fill background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, size, size);

      // The container size in CSS is fixed (e.g., 256px)
      // We need to map the visual transform to the canvas size
      const containerSize = 256; 
      const ratio = size / containerSize;

      // Transform context to match the visual manipulation
      ctx.translate(size / 2, size / 2);
      ctx.scale(scale, scale);
      ctx.translate(position.x * ratio, position.y * ratio);
      
      // Draw image centered
      // We need to account for the image aspect ratio
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let drawWidth = size;
      let drawHeight = size;

      if (imgRatio > 1) {
          drawHeight = size / imgRatio;
      } else {
          drawWidth = size * imgRatio;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      // Export
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setAvatarUrl(croppedDataUrl);
      setEditingImage(null); // Exit crop mode
  };

  // --- Render Crop View ---
  if (editingImage) {
      return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                   <button onClick={() => setEditingImage(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                       <ArrowLeft size={20} /> <span className="text-sm font-bold">Cancelar</span>
                   </button>
                   <h2 className="font-bold text-gray-900 dark:text-white">Ajustar Foto</h2>
                   <button onClick={generateCroppedImage} className="text-cyan-600 font-bold hover:text-cyan-700">
                       Salvar
                   </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <Move size={14} /> Arraste e pince para ajustar
                    </p>

                    {/* Crop Area Container */}
                    <div 
                        className="relative w-64 h-64 bg-black rounded-full overflow-hidden border-4 border-cyan-500 shadow-xl cursor-move touch-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchMove={handleMouseMove}
                        onTouchEnd={handleMouseUp}
                    >
                        {/* The Image */}
                        <img 
                            ref={imageRef}
                            src={editingImage}
                            alt="Crop Preview"
                            className="max-w-none absolute top-1/2 left-1/2 origin-center pointer-events-none select-none"
                            style={{
                                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                // Ensure image fits initially within the container based on its aspect ratio
                                width: '100%', 
                                height: 'auto'
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Controls */}
                    <div className="w-full mt-8 px-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Zoom</span>
                            <span className="text-xs font-bold text-cyan-600">{Math.round(scale * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ZoomIn size={16} className="text-gray-400" />
                            <input 
                                type="range" 
                                min="1" 
                                max="3" 
                                step="0.1" 
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                            />
                            <ZoomIn size={24} className="text-gray-800 dark:text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- Render Standard Form ---
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
           <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
               <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                   <X size={24} className="text-gray-500 dark:text-gray-400" />
               </button>
           </div>
           
           <form onSubmit={handleSubmit} className="p-6">
               <div className="flex flex-col items-center mb-6">
                   {/* Hidden File Input */}
                   <input 
                       type="file" 
                       ref={fileInputRef} 
                       onChange={handleFileChange} 
                       accept="image/*" 
                       className="hidden" 
                   />

                   <div 
                       className="relative group cursor-pointer" 
                       onClick={triggerFileSelect}
                       title="Alterar foto"
                   >
                       <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                       <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="text-white" />
                       </div>
                   </div>
                   
                   <button 
                       type="button" 
                       className="mt-2 text-cyan-600 font-bold text-sm hover:underline" 
                       onClick={triggerFileSelect}
                   >
                       Alterar Foto de Perfil
                   </button>
               </div>

               <div className="space-y-4">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                       <input 
                          type="text" 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome de Usuário</label>
                       <input 
                          type="text" 
                          value={handle}
                          onChange={e => setHandle(e.target.value)}
                          placeholder="@usuario"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                       <textarea 
                          value={bio}
                          onChange={e => setBio(e.target.value)}
                          rows={3}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                          placeholder="Sobre você..."
                       />
                   </div>
               </div>

               <div className="mt-8">
                   <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                       Salvar Alterações
                   </button>
               </div>
           </form>
       </div>
    </div>
  );
};