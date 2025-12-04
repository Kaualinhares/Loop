import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI;
  private modelId: string = "gemini-2.5-flash";

  constructor() {
    // Initialize with the API key from environment variables
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Generates a creative social media post based on a topic or draft.
   */
  async generatePostImprovement(draft: string): Promise<string> {
    try {
      const prompt = `Aja como um assistente de mídia social criativo para a rede social 'Loop'. 
      Melhore ou expanda o seguinte rascunho de texto para torná-lo mais engajador, divertido e viral.
      Mantenha o tom casual e use emojis se apropriado. O texto deve ser curto (max 280 caracteres).
      
      Rascunho: "${draft}"`;

      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
      });

      return response.text?.trim() || draft;
    } catch (error) {
      console.error("Erro ao conectar com Gemini:", error);
      throw new Error("Não foi possível gerar a sugestão no momento.");
    }
  }

  /**
   * Searches for places using Google Maps grounding.
   */
  async searchPlaces(query: string): Promise<string[]> {
    try {
      // We ask for a JSON list of names to make it easier to parse, 
      // although we must handle the response text carefully as it might contain extra text.
      const prompt = `List 5 real places or landmarks matching the query: "${query}". 
      Return ONLY the names of the places separated by commas, nothing else.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        }
      });

      const text = response.text || "";
      // Simple split by comma and cleanup
      const places = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      return places.length > 0 ? places : [query];
    } catch (error) {
      console.error("Erro no Gemini Maps:", error);
      // Fallback: just return the query as a "custom location"
      return [query];
    }
  }
}

export const geminiService = new GeminiService();