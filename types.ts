export interface AppConfig {
  gender: 'Nam' | 'Nữ';
  age: string;
  customPrompt: string; // User defined prompt
  options: {
    hair: boolean;
    asian: boolean;
    background: boolean;
    fidelity: boolean;
  };
  mode: 'high_quality' | 'colorize';
}

export interface PhotoSession {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  status: 'idle' | 'processing' | 'done' | 'error';
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  config?: AppConfig;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}