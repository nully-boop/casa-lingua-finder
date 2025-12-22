import { GoogleGenerativeAI } from "@google/generative-ai";
import IOffice from "@/interfaces/IOffice";

export interface OfficeAISuggestion {
  status: "approve" | "reject" | "review" | "loading" | "error";
  confidence: number;
  reasons: string[];
  documentAnalysis: {
    isValidDocument: boolean;
    documentType: string;
    documentIssues: string[];
  };
  locationAnalysis: {
    isValidLocation: boolean;
    locationType: string;
    locationIssues: string[];
  };
  profileAnalysis: {
    completeness: number;
    missingFields: string[];
    suggestions: string[];
  };
  summary: string;
}

export class OfficeAISuggestionService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  private createAnalysisPrompt(office: IOffice): string {
    return `
      Analyze this office registration and provide a comprehensive recommendation:

      Office Details:
      - Name: ${office.name}
      - Description: ${office.description || "Not provided"}
      - Location: ${office.location || "Not provided"}
      - Phone: ${office.phone}
      - Type: ${office.type}
      - Status: ${office.status}
      - Document URL: ${office.document?.url || "Not provided"}
      - Image URL: ${office.image?.url || "Not provided"}

      Please analyze this office registration and provide:

      1. Overall recommendation (approve/reject/review)
      2. Confidence level (0-100)
      3. 3-5 specific reasons for your recommendation

      4. Document Analysis:
         - Is the document valid for office registration?
         - What type of document appears to be (business license, registration certificate, etc.)?
         - Any issues with the document?

      5. Location Analysis:
         - Is the location valid and mappable?
         - What type of location format is provided (address, coordinates, etc.)?
         - Any issues with the location?

      6. Profile Analysis:
         - Profile completeness percentage
         - Missing important fields
         - Suggestions for improvement

      7. Overall summary

      Consider these factors:
      - Document should be official business documents (business license, commercial registration, etc.)
      - Location should be a valid address or coordinates that can be mapped
      - Office name should be professional and appropriate
      - Description should be relevant to real estate services
      - Phone number should be valid format

      Respond in JSON format:
      {
        "status": "approve|reject|review",
        "confidence": number,
        "reasons": ["reason1", "reason2", "reason3"],
        "documentAnalysis": {
          "isValidDocument": boolean,
          "documentType": "string",
          "documentIssues": ["issue1", "issue2"]
        },
        "locationAnalysis": {
          "isValidLocation": boolean,
          "locationType": "string",
          "locationIssues": ["issue1", "issue2"]
        },
        "profileAnalysis": {
          "completeness": number,
          "missingFields": ["field1", "field2"],
          "suggestions": ["suggestion1", "suggestion2"]
        },
        "summary": "string"
      }
    `;
  }

  private parseAIResponse(text: string): OfficeAISuggestion {
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const aiAnalysis = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (
      !aiAnalysis.status ||
      !aiAnalysis.confidence ||
      !aiAnalysis.reasons ||
      !aiAnalysis.documentAnalysis ||
      !aiAnalysis.locationAnalysis ||
      !aiAnalysis.profileAnalysis ||
      !aiAnalysis.summary
    ) {
      throw new Error("Incomplete AI response");
    }

    return aiAnalysis as OfficeAISuggestion;
  }

  public async analyzeOffice(office: IOffice): Promise<OfficeAISuggestion> {
    if (!this.genAI) {
      throw new Error("Gemini API key not found");
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      const prompt = this.createAnalysisPrompt(office);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error("Office AI Analysis Error:", error);
      throw error;
    }
  }

  public createLoadingSuggestion(): OfficeAISuggestion {
    return {
      status: "loading",
      confidence: 0,
      reasons: [],
      documentAnalysis: {
        isValidDocument: false,
        documentType: "",
        documentIssues: [],
      },
      locationAnalysis: {
        isValidLocation: false,
        locationType: "",
        locationIssues: [],
      },
      profileAnalysis: {
        completeness: 0,
        missingFields: [],
        suggestions: [],
      },
      summary: "Analyzing office registration...",
    };
  }

  public createErrorSuggestion(error?: string): OfficeAISuggestion {
    return {
      status: "error",
      confidence: 0,
      reasons: ["AI analysis failed", "Please review manually"],
      documentAnalysis: {
        isValidDocument: false,
        documentType: "Unknown",
        documentIssues: ["Analysis failed"],
      },
      locationAnalysis: {
        isValidLocation: false,
        locationType: "Unknown",
        locationIssues: ["Analysis failed"],
      },
      profileAnalysis: {
        completeness: 0,
        missingFields: [],
        suggestions: ["Manual review required"],
      },
      summary:
        error || "AI analysis encountered an error. Please review manually.",
    };
  }
}

// Export singleton instance
export const aiOfficeSuggestionService = new OfficeAISuggestionService();
