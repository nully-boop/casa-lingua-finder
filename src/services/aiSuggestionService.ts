import { GoogleGenerativeAI } from "@google/generative-ai";
import IProperty from "@/interfaces/IProperty";

export interface AISuggestion {
  status: 'approve' | 'reject' | 'review' | 'loading' | 'error';
  confidence: number;
  reasons: string[];
  priceAnalysis: {
    suggestedPrice: number;
    priceDifference: number;
    marketComparison: string;
  };
  summary: string;
}

export class AISuggestionService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  private createAnalysisPrompt(property: IProperty): string {
    return `
      Analyze this property listing and provide a recommendation on whether the price is appropriate:

      Property Details:
      - Title: ${property.title}
      - Type: ${property.type}
      - Ad Type: ${property.ad_type}
      - Location: ${property.location}
      - Price: ${property.price} ${property.currency}
      - Rooms: ${property.rooms}
      - Bathrooms: ${property.bathrooms}
      - Area: ${property.area}m²
      - Floor: ${property.floor_number}
      - Description: ${property.description}

      Please analyze this property and provide:
      1. A recommendation (approve/reject/review)
      2. Confidence level (0-100)
      3. 3-5 specific reasons for your recommendation
      4. Suggested fair market price
      5. Price difference analysis
      6. Market comparison summary
      7. Overall summary

      Respond in JSON format:
      {
        "status": "approve|reject|review",
        "confidence": number,
        "reasons": ["reason1", "reason2", "reason3"],
        "priceAnalysis": {
          "suggestedPrice": number,
          "priceDifference": number,
          "marketComparison": "string"
        },
        "summary": "string"
      }
    `;
  }

  private parseAIResponse(text: string): AISuggestion {
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const aiAnalysis = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!aiAnalysis.status || !aiAnalysis.confidence || !aiAnalysis.reasons || !aiAnalysis.priceAnalysis || !aiAnalysis.summary) {
      throw new Error('Incomplete AI response');
    }

    return aiAnalysis as AISuggestion;
  }

  public async analyzeProperty(property: IProperty): Promise<AISuggestion> {
    if (!this.genAI) {
      throw new Error('Gemini API key not found');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const prompt = this.createAnalysisPrompt(property);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  public createLoadingSuggestion(): AISuggestion {
    return {
      status: 'loading',
      confidence: 0,
      reasons: [],
      priceAnalysis: {
        suggestedPrice: 0,
        priceDifference: 0,
        marketComparison: ''
      },
      summary: 'Analyzing property...'
    };
  }

  public createErrorSuggestion(error?: string): AISuggestion {
    return {
      status: 'error',
      confidence: 0,
      reasons: ['AI analysis failed', 'Please review manually'],
      priceAnalysis: {
        suggestedPrice: 0,
        priceDifference: 0,
        marketComparison: 'Analysis unavailable'
      },
      summary: error || 'AI analysis encountered an error. Please review manually.'
    };
  }
}

// Export singleton instance
export const aiSuggestionService = new AISuggestionService();
