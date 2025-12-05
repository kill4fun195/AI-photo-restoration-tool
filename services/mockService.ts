import { ApiResponse, PhotoSession } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

class MockService {
  private STORAGE_KEY = 'photo_restoration_sessions';

  private getSessionsFromStorage(): PhotoSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveSessionsToStorage(sessions: PhotoSession[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  // Simulate uploading an image
  async uploadImage(file: File): Promise<ApiResponse<PhotoSession>> {
    await delay(800); // Simulate network latency

    const sessions = this.getSessionsFromStorage();
    
    // In a real app, this would upload to S3/Cloudinary.
    // Here we use URL.createObjectURL for the "local" Original URL.
    const originalUrl = URL.createObjectURL(file);

    const newSession: PhotoSession = {
      id: generateId(),
      originalUrl,
      processedUrl: null,
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    sessions.unshift(newSession);
    this.saveSessionsToStorage(sessions);

    return {
      code: 200,
      message: 'success',
      data: newSession,
    };
  }

  // Simulate processing logic
  async processImage(sessionId: string): Promise<ApiResponse<PhotoSession>> {
    // Simulate long processing time as per spec (20-25s, but we'll do 3s for UX demo purposes)
    await delay(3000); 

    const sessions = this.getSessionsFromStorage();
    const index = sessions.findIndex(s => s.id === sessionId);

    if (index === -1) {
      return { code: 404, message: 'Session not found', data: {} as PhotoSession };
    }

    // Mocking the result:
    // We'll use a Picsum image to simulate the "result".
    // To make it look like a transformation, we use a distinct seed.
    // In a real mock, we might use the same image with a filter applied via Canvas, 
    // but for "Restoration" demo, a high-quality placeholder is sufficient.
    const processedUrl = `https://picsum.photos/seed/${sessionId}_after/800/800`;

    sessions[index].status = 'done';
    sessions[index].processedUrl = processedUrl;
    sessions[index].updatedAt = Date.now();

    this.saveSessionsToStorage(sessions);

    return {
      code: 200,
      message: 'Processing complete',
      data: sessions[index],
    };
  }

  async getHistory(): Promise<ApiResponse<PhotoSession[]>> {
    await delay(500);
    return {
      code: 200,
      message: 'success',
      data: this.getSessionsFromStorage(),
    };
  }
}

export const mockService = new MockService();
