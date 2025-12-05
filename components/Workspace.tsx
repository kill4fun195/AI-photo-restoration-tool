import React from 'react';
import { Upload, Download } from 'lucide-react';
import { PhotoSession } from '../types';
import ComparisonSlider from './ComparisonSlider';

interface WorkspaceProps {
  session: PhotoSession | null;
  onUploadTrigger: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ session, onUploadTrigger }) => {
  // 1. Empty State
  if (!session) {
    return (
      <div 
        onClick={onUploadTrigger}
        className="w-full h-full flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-bg-tertiary rounded-xl m-4 cursor-pointer hover:border-accent-primary hover:bg-bg-secondary/50 transition-all group"
      >
        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8 text-accent-primary" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Tải ảnh lên</h2>
        <p className="text-sm">Hỗ trợ JPG, PNG, WEBP</p>
      </div>
    );
  }

  // 2. Processing State
  if (session.status === 'processing') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-bg-primary relative">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Animated rings */}
          <div className="absolute inset-0 border-4 border-bg-tertiary rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-accent-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        
        <h3 className="mt-8 text-lg font-medium text-white">AI đang phục chế ảnh của bạn...</h3>
        <p className="text-text-secondary mt-2 text-sm">Vui lòng đợi khoảng 20-25s</p>
      </div>
    );
  }

  // 3. Result State (Comparison)
  if (session.status === 'done' && session.processedUrl) {
    return (
      <div className="w-full h-full p-6 relative flex flex-col">
        <div className="flex-1 min-h-0 relative">
          <ComparisonSlider 
            beforeImage={session.originalUrl}
            afterImage={session.processedUrl}
          />
        </div>

        {/* Floating Action Button */}
        <a 
          href={session.processedUrl}
          download={`restored_${session.id}.jpg`}
          className="absolute bottom-10 right-10 bg-accent-primary hover:bg-accent-hover text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all hover:-translate-y-1"
        >
          <Download className="w-5 h-5" />
          Tải Xuống
        </a>
      </div>
    );
  }

  // 4. Default View (Just uploaded, not processed)
  return (
    <div className="w-full h-full p-6 flex items-center justify-center bg-bg-primary">
       <img 
          src={session.originalUrl} 
          alt="Original Preview" 
          className="max-w-full max-h-full object-contain rounded shadow-lg border border-bg-tertiary"
        />
    </div>
  );
};

export default Workspace;