import React, { useState, useEffect } from 'react';
import ThumbnailStrip from './components/ThumbnailStrip';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import { AppConfig, PhotoSession } from './types';
import { mockService } from './services/mockService';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  // Global State
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Settings State
  const [config, setConfig] = useState<AppConfig>({
    gender: 'Nam',
    age: '',
    customPrompt: '',
    options: {
      hair: true,
      asian: true,
      background: true,
      fidelity: true,
    },
    mode: 'high_quality'
  });

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await mockService.getHistory();
      if (res.code === 200) {
        setSessions(res.data);
        if (res.data.length > 0) setActiveSessionId(res.data[0].id);
      }
    };
    fetchHistory();
  }, []);

  // Helpers
  const urlToBase64 = async (url: string): Promise<{ data: string; mimeType: string }> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result is "data:image/png;base64,..."
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve({ data: base64Data, mimeType: blob.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const constructPrompt = (cfg: AppConfig): string => {
    // Basic instruction
    let prompt = "Restore this image. Improve quality, sharpen details, and reduce noise.";
    
    // Custom overrides base logic if provided significantly, but we append it to context.
    // However, if user wants to EDIT (e.g. "remove background"), we should prioritize that.
    
    // Add specific restoration details
    if (cfg.mode === 'colorize') {
      prompt += " Colorize the image naturally.";
    }

    const details = [];
    if (cfg.gender) details.push(`Subject gender is ${cfg.gender}.`);
    if (cfg.age) details.push(`Subject appears to be around ${cfg.age} years old.`);
    if (cfg.options.hair) details.push("Fix messy hair and render realistic hair details.");
    if (cfg.options.asian) details.push("Preserve or enhance Asian facial features if present.");
    if (cfg.options.background) details.push("Clarify and enhance the background details.");
    if (cfg.options.fidelity) details.push("Maintain high fidelity to the original facial structure.");

    if (details.length > 0) {
      prompt += " Context: " + details.join(" ");
    }

    // Append custom user instructions
    if (cfg.customPrompt && cfg.customPrompt.trim().length > 0) {
      prompt += `\nAdditional Instructions: ${cfg.customPrompt}`;
    }

    return prompt;
  };

  // Handlers
  const handleUpload = async (file: File) => {
    const res = await mockService.uploadImage(file);
    if (res.code === 200) {
      setSessions(prev => [res.data, ...prev]);
      setActiveSessionId(res.data.id);
    }
  };

  const handleProcess = async () => {
    if (!activeSessionId) return;

    // 1. UI Feedback: Processing
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, status: 'processing' } : s
    ));

    try {
      // 2. Prepare Data
      const session = sessions.find(s => s.id === activeSessionId);
      if (!session) throw new Error("Session lost");

      const { data: base64Data, mimeType } = await urlToBase64(session.originalUrl);
      const prompt = constructPrompt(config);

      // 3. Call Real AI
      const processedImageUrl = await geminiService.editImage(base64Data, mimeType, prompt);

      // 4. Update Session with Result
      const updatedSession: PhotoSession = {
        ...session,
        status: 'done',
        processedUrl: processedImageUrl,
        updatedAt: Date.now(),
        config: config // Save config used
      };

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? updatedSession : s
      ));

      // Note: We aren't saving the result back to localStorage in this demo 
      // because data URLs for images are too large for localStorage quota.
      // In a real app, you'd upload the result to cloud storage here.

    } catch (error) {
      console.error("Restoration failed", error);
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, status: 'error' } : s
      ));
      alert("Quá trình phục chế thất bại. Vui lòng thử lại.");
    }
  };

  const handleReset = () => {
    const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (uploadInput) uploadInput.click();
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  return (
    <div className="w-screen h-screen bg-bg-primary text-text-primary grid grid-rows-[100px_1fr] grid-cols-[300px_1fr] overflow-hidden">
      
      {/* Top Region: Thumbnail Strip */}
      <div className="col-span-2 row-span-1 border-b border-bg-tertiary">
        <ThumbnailStrip 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={setActiveSessionId}
          onUpload={handleUpload}
        />
      </div>

      {/* Left Region: Sidebar */}
      <div className="col-span-1 row-span-1 h-full overflow-hidden">
        <Sidebar 
          config={config}
          setConfig={setConfig}
          onProcess={handleProcess}
          onReset={handleReset}
          isProcessing={activeSession?.status === 'processing'}
          hasActiveImage={!!activeSession}
        />
      </div>

      {/* Center Region: Workspace */}
      <div className="col-span-1 row-span-1 h-full overflow-hidden bg-bg-primary">
        <Workspace 
          session={activeSession}
          onUploadTrigger={handleReset} 
        />
      </div>

    </div>
  );
};

export default App;