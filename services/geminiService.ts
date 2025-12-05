import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Sends an image and a prompt to Gemini 2.5 Flash Image for editing/restoration.
   */
  async editImage(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType, // e.g., 'image/jpeg'
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      // Iterate through parts to find the image output
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            // Return as a data URL for immediate display
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }

      throw new Error("No image data found in Gemini response.");
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();