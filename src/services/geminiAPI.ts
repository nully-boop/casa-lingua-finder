import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
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

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const locationParts = [
    property.address,
    property.area_name,
    property.city_name,
  ].filter(Boolean);
  const locationString =
    locationParts.length > 0 ? locationParts.join(", ") : "N/A";

  const prompt = `You are a helpful and friendly real estate assistant called 'Casa AI' for a platform called 'Aqar Zone'. You are talking to a potential buyer about a property. Your goal is to answer their questions accurately based on the information provided and encourage them to consider the property. Be conversational and professional.

IMPORTANT: Always respond in the same language as the user's question. If the user asks in Arabic, respond in Arabic. If the user asks in English, respond in English. Match the user's language exactly.

Property Details:
- Title: ${property.title}
- Description: ${property.description}
- Price: ${property.price} ${property.currency}
- Type: ${property.type} for ${property.ad_type}
- Location: ${locationString}
- Size: ${property.area} m²
- Bedrooms: ${property.bedrooms || property.rooms || "N/A"}
- Bathrooms: ${property.bathrooms}

The user's question is: "${question}"

Please answer the user's question in the same language they used. If the information is not available in the details provided, politely state that you don't have that specific information but you can answer other questions.`;

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  for await (const chunk of result.stream) {
    onChunk(chunk.text());
  }
};

// Add a new function for chatting with data from API
export const runMultiPropertyChat = async (
  apiKey: string,
  properties: IProperty[],
  question: string,
  onChunk: (chunk: string) => void
) => {
  if (!apiKey) {
    throw new Error("API Key is required.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // Format properties data for the prompt
  const propertiesData = properties
    .slice(0, 5)
    .map((property) => {
      const locationParts = [
        property.address,
        property.area_name,
        property.city_name,
      ].filter(Boolean);
      const locationString =
        locationParts.length > 0 ? locationParts.join(", ") : "N/A";

      return `
Property ID: ${property.id}
Title: ${property.title}
Price: ${property.price} ${property.currency}
Type: ${property.type} for ${property.ad_type}
Location: ${locationString}
Size: ${property.area} m²
Bedrooms: ${property.bedrooms || property.rooms || "N/A"}
Bathrooms: ${property.bathrooms || "N/A"}
`;
    })
    .join("\n---\n");

  const prompt = `You are a helpful and friendly real estate assistant called 'Casa AI' for a platform called 'Aqar Zone'. You are talking to a potential buyer about properties on our platform. Your goal is to answer their questions based on the available property listings and help them find suitable options.

IMPORTANT: Always respond in the same language as the user's question. If the user asks in Arabic, respond in Arabic. If the user asks in English, respond in English. Match the user's language exactly.

Here are some of our current property listings:

${propertiesData}

The user's question is: "${question}"

Please answer the user's question in the same language they used. If they're asking about specific properties, reference the relevant listings by ID or title. If they're asking general questions about real estate, provide helpful information based on your knowledge. If they're looking for properties with specific features, recommend suitable options from the listings provided.`;

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  for await (const chunk of result.stream) {
    onChunk(chunk.text());
  }
};
