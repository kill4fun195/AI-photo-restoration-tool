import React, { useRef } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { PhotoSession } from '../types';

interface ThumbnailStripProps {
  sessions: PhotoSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onUpload: (file: File) => void;
}

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelect,
  onUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full bg-bg-primary border-b border-bg-tertiary flex items-center px-4 gap-3 overflow-x-auto">
      {/* Upload Button */}
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-bg-tertiary flex flex-col items-center justify-center text-text-secondary hover:border-accent-primary hover:text-white transition-all gap-1"
      >
        <Plus className="w-6 h-6" />
        <span className="text-[10px] font-medium">Thêm ảnh</span>
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Thumbnails */}
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSelect(session.id)}
          className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
            activeSessionId === session.id 
              ? 'border-accent-primary shadow-[0_0_10px_rgba(124,77,255,0.4)]' 
              : 'border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          <img 
            src={session.processedUrl || session.originalUrl} 
            alt="Thumbnail" 
            className="w-full h-full object-cover"
          />
          {session.status === 'processing' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {session.status === 'done' && (
            <div className="absolute bottom-0 right-0 p-0.5 bg-accent-primary rounded-tl-md">
              <ImageIcon className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThumbnailStrip;