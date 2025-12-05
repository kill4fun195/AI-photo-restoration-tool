import React, { useState } from 'react';
import { Wand2, RefreshCw, Layers, User, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import Button from './Button';
import { AppConfig } from '../types';

interface SidebarProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasActiveImage: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  config, 
  setConfig, 
  onProcess, 
  onReset,
  isProcessing,
  hasActiveImage
}) => {
  
  const updateOption = (key: keyof AppConfig['options']) => {
    setConfig(prev => ({
      ...prev,
      options: { ...prev.options, [key]: !prev.options[key] }
    }));
  };

  return (
    <aside className="h-full bg-bg-secondary border-r border-bg-tertiary flex flex-col overflow-y-auto p-5 gap-6">
      
      {/* 1. Restoration Mode */}
      <section>
        <h3 className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Chế độ phục chế
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setConfig(prev => ({ ...prev, mode: 'high_quality' }))}
            className={`w-full p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between ${
              config.mode === 'high_quality' 
                ? 'bg-accent-primary/10 border-accent-primary text-white' 
                : 'border-bg-tertiary text-text-secondary hover:border-text-secondary'
            }`}
          >
            Phục chế chất lượng cao
            {config.mode === 'high_quality' && <CheckCircle2 className="w-4 h-4 text-accent-primary" />}
          </button>
          
          <button
            onClick={() => setConfig(prev => ({ ...prev, mode: 'colorize' }))}
            className={`w-full p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between ${
              config.mode === 'colorize' 
                ? 'bg-accent-primary/10 border-accent-primary text-white' 
                : 'border-bg-tertiary text-text-secondary hover:border-text-secondary'
            }`}
          >
            Phục chế 5-10 màu
            {config.mode === 'colorize' && <CheckCircle2 className="w-4 h-4 text-accent-primary" />}
          </button>
        </div>
      </section>

      <hr className="border-bg-tertiary" />

      {/* 2. Subject Info */}
      <section>
        <h3 className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Thông tin chủ thể
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Giới tính</label>
            <div className="flex bg-bg-primary rounded-lg p-1">
              {(['Nam', 'Nữ'] as const).map(gender => (
                <button
                  key={gender}
                  onClick={() => setConfig(prev => ({ ...prev, gender }))}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                    config.gender === gender 
                      ? 'bg-bg-tertiary text-white shadow-sm' 
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Độ tuổi</label>
            <input 
              type="number"
              value={config.age}
              onChange={(e) => setConfig(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Ví dụ: 65"
              className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-primary text-sm placeholder-text-secondary/50"
            />
            <p className="text-[10px] text-text-secondary mt-1">Nhập tuổi ước lượng để AI tái tạo da phù hợp</p>
          </div>
        </div>
      </section>

      <hr className="border-bg-tertiary" />

      {/* 3. Advanced Options */}
      <section>
        <h3 className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-3">
          Tùy chọn thêm
        </h3>
        <div className="space-y-3">
          {[
            { id: 'hair', label: 'Vẽ lại tóc rối chi tiết' },
            { id: 'asian', label: 'Người Châu Á (Tóc đen)' },
            { id: 'background', label: 'Làm rõ và hậu cảnh' },
            { id: 'fidelity', label: 'Bám theo chi tiết khuôn mặt' },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={config.options[item.id as keyof AppConfig['options']]}
                  onChange={() => updateOption(item.id as keyof AppConfig['options'])}
                  className="peer appearance-none h-5 w-5 border border-bg-tertiary rounded bg-bg-primary checked:bg-accent-primary checked:border-accent-primary transition-all"
                />
                <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 pointer-events-none" />
              </div>
              <span className="text-sm text-text-secondary group-hover:text-white transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* 4. Custom Prompt */}
      <section>
         <h3 className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          Yêu cầu tùy chỉnh
        </h3>
        <textarea 
          value={config.customPrompt}
          onChange={(e) => setConfig(prev => ({ ...prev, customPrompt: e.target.value }))}
          placeholder="VD: Thêm bộ lọc cổ điển, xóa người ở nền..."
          className="w-full h-24 bg-bg-primary border border-bg-tertiary rounded-lg p-3 text-white focus:outline-none focus:border-accent-primary text-sm placeholder-text-secondary/50 resize-none"
        />
      </section>

      <div className="mt-auto space-y-3 pt-4">
        <Button 
          variant="gradient" 
          className="w-full" 
          icon={<Wand2 className="w-5 h-5" />}
          onClick={onProcess}
          isLoading={isProcessing}
          disabled={!hasActiveImage}
        >
          {isProcessing ? 'Đang xử lý AI...' : 'Phục Chế Ảnh'}
        </Button>
        
        <Button 
          variant="danger" 
          className="w-full"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={onReset}
          disabled={isProcessing}
        >
          Làm Lại Ảnh Mới
        </Button>
      </div>

    </aside>
  );
};

export default Sidebar;