import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if API key is available
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Google Gemini API key not found. AI features will be disabled.');
}

// Initialize the Google Generative AI client
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Get the Gemini model
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-pro" }) : null;

/**
 * Convert File to base64 string for Gemini API
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Generate property title based on uploaded images
 */
export const generatePropertyTitle = async (images: File[]): Promise<string> => {
  try {
    if (!model) {
      throw new Error('AI service is not available. Please check your API key configuration.');
    }

    if (!images || images.length === 0) {
      throw new Error('No images provided for title generation');
    }

    // Use the first image for analysis
    const firstImage = images[0];
    const base64Image = await fileToBase64(firstImage);

    const prompt = `
      Analyze this property image and generate a compelling, professional property title in English.
      
      Requirements:
      - Maximum 60 characters
      - Include property type (apartment, villa, house, etc.)
      - Mention key features visible in the image
      - Use attractive real estate language
      - Be specific and descriptive
      - Examples: "Luxury Modern Villa with Pool", "Spacious 3BR Apartment Downtown", "Contemporary Office Space"
      
      Generate only the title, no additional text or explanation.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: firstImage.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const title = response.text().trim();

    // Clean up the title (remove quotes if present)
    return title.replace(/^["']|["']$/g, '');

  } catch (error) {
    console.error('Error generating property title:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate property title. Please try again.');
  }
};

/**
 * Generate property description based on uploaded images
 */
export const generatePropertyDescription = async (images: File[]): Promise<string> => {
  try {
    if (!model) {
      throw new Error('AI service is not available. Please check your API key configuration.');
    }

    if (!images || images.length === 0) {
      throw new Error('No images provided for description generation');
    }

    // Use the first image for analysis
    const firstImage = images[0];
    const base64Image = await fileToBase64(firstImage);

    const prompt = `
      Analyze this property image and generate a detailed, professional property description in English.
      
      Requirements:
      - 150-300 words
      - Describe the property type and style
      - Mention visible features, amenities, and finishes
      - Include information about layout and space
      - Use professional real estate language
      - Highlight selling points and unique features
      - Make it appealing to potential buyers/renters
      - Be accurate based on what you can see in the image
      
      Structure the description with:
      1. Opening statement about the property
      2. Key features and amenities
      3. Space and layout details
      4. Closing statement about lifestyle/benefits
      
      Generate only the description, no additional text or explanation.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: firstImage.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const description = response.text().trim();

    return description;

  } catch (error) {
    console.error('Error generating property description:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate property description. Please try again.');
  }
};

/**
 * Generate both title and description in one call (more efficient)
 */
export const generatePropertyContent = async (images: File[]): Promise<{title: string, description: string}> => {
  try {
    if (!model) {
      throw new Error('AI service is not available. Please check your API key configuration.');
    }

    if (!images || images.length === 0) {
      throw new Error('No images provided for content generation');
    }

    // Use the first image for analysis
    const firstImage = images[0];
    const base64Image = await fileToBase64(firstImage);

    const prompt = `
      Analyze this property image and generate both a title and description for a real estate listing.
      
      TITLE Requirements:
      - Maximum 60 characters
      - Include property type
      - Mention key features
      - Professional and attractive
      
      DESCRIPTION Requirements:
      - 150-300 words
      - Detailed and professional
      - Highlight visible features
      - Appeal to buyers/renters
      
      Format your response as JSON:
      {
        "title": "Generated title here",
        "description": "Generated description here"
      }
      
      Generate only the JSON, no additional text.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: firstImage.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();

    try {
      // Parse the JSON response
      const content = JSON.parse(text);
      return {
        title: content.title?.replace(/^["']|["']$/g, '') || '',
        description: content.description || ''
      };
    } catch {
      // Fallback: try to extract title and description manually
      console.warn('Failed to parse JSON response, using fallback extraction');
      
      // Generate title and description separately
      const [title, description] = await Promise.all([
        generatePropertyTitle(images),
        generatePropertyDescription(images)
      ]);
      
      return { title, description };
    }

  } catch (error) {
    console.error('Error generating property content:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate property content. Please try again.');
  }
};

/**
 * Generate property description based on complete property data
 */
export const generatePropertyDescriptionFromData = async (propertyData: {
  title?: string;
  property_type?: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  floor_number?: number;
  furnishing?: string;
  features?: string[];
  price?: number;
  currency?: string;
  ad_type?: string;
  status?: string;
  seller_type?: string;
  location?: string;
  governorate?: string;
  images?: File[];
  videos?: File[];
}): Promise<string> => {
  try {
    if (!model) {
      throw new Error('AI service is not available. Please check your API key configuration.');
    }

    // Create a comprehensive prompt with all property information
    const prompt = `
      Generate a compelling, professional property description based on the following details:

      PROPERTY INFORMATION:
      - Title: ${propertyData.title || 'Not specified'}
      - Type: ${propertyData.property_type || 'Not specified'}
      - Area: ${propertyData.area ? `${propertyData.area} m²` : 'Not specified'}
      - Rooms: ${propertyData.rooms || 'Not specified'}
      - Bathrooms: ${propertyData.bathrooms || 'Not specified'}
      - Floor: ${propertyData.floor_number || 'Not specified'}
      - Furnishing: ${propertyData.furnishing || 'Not specified'}
      - Features: ${propertyData.features?.length ? propertyData.features.join(', ') : 'None specified'}

      PRICING:
      - Price: ${propertyData.price && propertyData.currency ? `${propertyData.price} ${propertyData.currency}` : 'Not specified'}
      - Type: ${propertyData.ad_type || 'Not specified'}
      - Status: ${propertyData.status || 'Available'}
      - Seller Type: ${propertyData.seller_type || 'Owner'}

      LOCATION:
      - Address: ${propertyData.location || 'Not specified'}
      - Governorate: ${propertyData.governorate || 'Not specified'}

      MEDIA:
      - Images: ${propertyData.images?.length || 0}
      - Videos: ${propertyData.videos?.length || 0}

      REQUIREMENTS:
      - Write a professional, engaging property description (200-400 words)
      - Highlight key selling points and unique features
      - Use attractive real estate language
      - Mention the location benefits
      - Include lifestyle and investment appeal
      - Structure with clear paragraphs
      - Be specific about the property's advantages
      - Appeal to potential ${propertyData.ad_type === 'rent' ? 'tenants' : 'buyers'}

      Generate only the description text, no additional formatting or explanations.
    `;

    // If we have images, include the first one for visual context
    let parts: any[] = [prompt];
    if (propertyData.images && propertyData.images.length > 0) {
      try {
        const firstImage = propertyData.images[0];
        const base64Image = await fileToBase64(firstImage);

        parts = [
          prompt + "\n\nAdditionally, analyze the provided property image to enhance the description with visual details.",
          {
            inlineData: {
              data: base64Image,
              mimeType: firstImage.type,
            },
          }
        ];
      } catch (imageError) {
        console.warn('Could not process image for description generation:', imageError);
        // Continue without image
      }
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const description = response.text().trim();

    return description;

  } catch (error) {
    console.error('Error generating property description from data:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate property description. Please try again.');
  }
};

/**
 * Check if AI service is available
 */
export const isAIServiceAvailable = (): boolean => {
  return !!apiKey && !!model;
};

export default {
  generatePropertyTitle,
  generatePropertyDescription,
  generatePropertyContent,
  generatePropertyDescriptionFromData,
  isAIServiceAvailable,
};
