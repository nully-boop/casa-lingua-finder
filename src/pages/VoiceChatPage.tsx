import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import VoiceChat from "@/components/VoiceChat";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";

const VoiceChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  // Get parameters from URL
  const apiKey = searchParams.get("apiKey") || "";
  const propertyId = searchParams.get("propertyId");
  const chatType = searchParams.get("type") || "global"; // "global" or "property"
  
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  // Fetch properties data for global chat
  const {
    data: propertiesData,
    isLoading: isPropertiesLoading,
    error: propertiesError,
  } = useQuery<IProperty[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await propertiesAPI.getProperties();
      return response.data.data;
    },
    enabled: chatType === "global",
  });

  // Fetch specific property data for property chat
  const {
    data: propertyData,
    isLoading: isPropertyLoading,
    error: propertyError,
  } = useQuery<IProperty>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("Property ID is required");
      console.log("Fetching property with ID:", propertyId);
      try {
        const response = await propertiesAPI.getProperty(propertyId);
        console.log("Property API response:", response);
        return response.data.property; // Extract the property data from the response
      } catch (error) {
        console.error("Error fetching property:", error);
        throw error;
      }
    },
    enabled: chatType === "property" && !!propertyId,
  });

  // Create context data based on chat type
  const createContextData = () => {
    if (chatType === "property") {
      if (propertyData) {
        const locationParts = [
          propertyData.address,
          propertyData.area_name,
          propertyData.city_name,
        ].filter(Boolean);
        const locationString = locationParts.length > 0 ? locationParts.join(", ") : propertyData.location || "N/A";

        return `Property Details:
Title: ${propertyData.title || 'Untitled Property'}
Price: ${propertyData.price || 'N/A'} ${propertyData.currency || ''}
Area: ${propertyData.area || 'N/A'}m²
Location: ${locationString}
Type: ${propertyData.type || 'N/A'} for ${propertyData.ad_type || 'N/A'}
Bedrooms: ${propertyData.bedrooms || propertyData.rooms || 'N/A'}
Bathrooms: ${propertyData.bathrooms || 'N/A'}
Description: ${propertyData.description || 'No description available'}`;
      } else {
        // Fallback when property data couldn't be loaded
        return `I'm a real estate AI assistant. I was unable to load the specific property information you requested, but I can still help you with general real estate questions, market information, property advice, and answer any questions you might have about buying, selling, or renting properties.`;
      }
    }

    // Global chat context
    if (isPropertiesLoading) {
      return "I'm a real estate AI assistant. The property database is currently loading. Please wait a moment and try again.";
    }

    if (propertiesError) {
      return "I'm a real estate AI assistant. There was an error loading the property database. I can still provide general real estate advice.";
    }

    if (!propertiesData || !Array.isArray(propertiesData) || propertiesData.length === 0) {
      return "I'm a real estate AI assistant. I can help you with property-related questions, market information, and general real estate advice. Please note that I don't have access to the current property database at the moment, but I can still provide general assistance.";
    }

    return `Available Properties Database:
Total Properties: ${propertiesData.length}

Property Listings:
${propertiesData.map((property, index) =>
  `${index + 1}. ${property.title || 'Untitled Property'}
   - Price: ${property.price || 'N/A'} ${property.currency || ''}
   - Area: ${property.area || 'N/A'}m²
   - Location: ${property.location || property.address || 'N/A'}
   - Type: ${property.ad_type || property.type || 'N/A'}
   - Bedrooms: ${property.bedrooms || property.rooms || 'N/A'}
   - Bathrooms: ${property.bathrooms || 'N/A'}`
).join('\n\n')}`;
  };

  // Create system prompt based on chat type
  const createSystemPrompt = () => {
    const hasData = chatType === "property" ? !!propertyData : (propertiesData && Array.isArray(propertiesData) && propertiesData.length > 0);

    if (chatType === "property") {
      return `You are a helpful real estate AI assistant specializing in property inquiries.
${hasData ?
  'You have detailed information about a specific property. Use this information to answer questions about the property, its features, location, pricing, and any other relevant details.' :
  'The specific property information could not be loaded, but you can still provide general real estate advice, market information, and help with property-related questions.'
}

Always respond in Arabic if the user speaks Arabic, otherwise respond in English.
Be friendly, professional, and helpful.
Keep responses concise and conversational for voice interaction.
${hasData ? 'Focus on the specific property details when answering questions.' : 'Provide general real estate guidance and advice.'}`;
    }

    return `You are a helpful real estate AI assistant for a property platform in Saudi Arabia.
${hasData ?
  `You have access to a comprehensive database of ${propertiesData?.length} properties including apartments, villas, and commercial spaces.
  Use the provided property data to give specific recommendations, prices, and details.
  When users ask about properties, reference the actual listings from the database.` :
  'You can provide general real estate advice and information, but note that the property database is not currently available.'
}

Always respond in Arabic if the user speaks Arabic, otherwise respond in English.
Be friendly, professional, and helpful.
Keep responses concise and conversational for voice interaction.
When mentioning properties, include key details like price, location, and size.`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleConversationEnd = () => {
    // Optionally navigate back when conversation ends
    // navigate(-1);
  };

  const isLoading = chatType === "global" ? isPropertiesLoading : isPropertyLoading;
  const hasError = chatType === "global" ? propertiesError : propertyError;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">
                {chatType === "property" 
                  ? (propertyData?.title || t("aiChat.propertyVoiceChat") || "Property Voice Chat")
                  : (t("aiChat.globalVoiceChat") || "AI Voice Assistant")
                }
              </h1>
              <p className="text-sm text-muted-foreground">
                {chatType === "property" 
                  ? (t("aiChat.propertyVoiceChatDescription") || "Ask questions about this property")
                  : (t("aiChat.globalVoiceChatDescription") || "Ask about our properties and real estate services")
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* API Key Input */}
          {!localApiKey && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-medium mb-2">
                  {t("aiChat.enterApiKey") || "Enter your Gemini API Key"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("aiChat.apiKeyRequired") || "API key is required to start voice chat"}
                </p>
              </div>
              <Input
                type="password"
                placeholder={t("aiChat.apiKeyPlaceholder") || "Enter your Gemini API key"}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="text-center"
              />
            </div>
          )}

          {/* Loading State */}
          {localApiKey && isLoading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {chatType === "property" 
                  ? "Loading property information..."
                  : "Loading properties database..."
                }
              </p>
            </div>
          )}



          {/* Voice Chat Component */}
          {localApiKey && !isLoading && (
            <div className="space-y-4">
              {hasError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ {chatType === "property"
                      ? "Property data couldn't be loaded, but you can still chat about general real estate topics."
                      : "Properties database couldn't be loaded, but you can still get general real estate assistance."
                    }
                  </p>
                </div>
              )}
              <VoiceChat
                geminiApiKey={localApiKey}
                contextData={createContextData()}
                systemPrompt={createSystemPrompt()}
                onConversationEnd={handleConversationEnd}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChatPage;
