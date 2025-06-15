
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import IProperty from "@/interfaces/IProperty";

export const runChat = async (
  apiKey: string,
  property: IProperty,
  question: string,
  onChunk: (chunk: string) => void
) => {
  if (!apiKey) {
    throw new Error("API Key is required.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const prompt = `You are a helpful and friendly real estate assistant for a platform called 'CasaLingua'. You are talking to a potential buyer about a property. Your goal is to answer their questions accurately based on the information provided and encourage them to consider the property. Be conversational and professional.

Property Details:
- Title: ${property.title}
- Description: ${property.description}
- Price: ${property.price} ${property.currency}
- Type: ${property.type} for ${property.ad_type}
- Location: ${property.address || 'N/A'}, ${property.area_name}, ${property.city_name}
- Size: ${property.area} m²
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}

The user's question is: "${question}"

Please answer the user's question. If the information is not available in the details provided, politely state that you don't have that specific information but you can answer other questions.`;
  
  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  for await (const chunk of result.stream) {
    onChunk(chunk.text());
  }
};
