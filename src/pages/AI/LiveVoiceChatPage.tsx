import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, RotateCcw, Square } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";
import { GoogleGenAI, LiveServerMessage, Modality, Session } from "@google/genai";

interface AudioProcessor {
  context: AudioContext;
  sourceNode: MediaStreamAudioSourceNode | null;
  scriptProcessor: ScriptProcessorNode | null;
  gainNode: GainNode;
}

const LiveVoiceChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  // Get parameters from URL
  const apiKey = searchParams.get("apiKey") || "";
  const propertyId = searchParams.get("propertyId");
  const chatType = searchParams.get("type") || "global";
  
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Ready to start");
  const [error, setError] = useState("");
  
  // Audio setup
  const [inputAudioContext] = useState(() => new AudioContext({ sampleRate: 16000 }));
  const [outputAudioContext] = useState(() => new AudioContext({ sampleRate: 24000 }));
  const inputGainRef = useRef<GainNode | null>(null);
  const outputGainRef = useRef<GainNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const processorRef = useRef<AudioProcessor | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

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
      const response = await propertiesAPI.getProperty(propertyId);
      return response.data.property;
    },
    enabled: chatType === "property" && !!propertyId,
  });

  // Initialize audio nodes
  useEffect(() => {
    inputGainRef.current = inputAudioContext.createGain();
    outputGainRef.current = outputAudioContext.createGain();
    outputGainRef.current.connect(outputAudioContext.destination);
    nextStartTimeRef.current = outputAudioContext.currentTime;
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.scriptProcessor?.disconnect();
      processorRef.current.sourceNode?.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    for (const source of audioSourcesRef.current) {
      source.stop();
    }
    audioSourcesRef.current.clear();
  }, []);

  const createBlob = (pcmData: Float32Array): Blob => {
    const arrayBuffer = new ArrayBuffer(pcmData.length * 2);
    const view = new DataView(arrayBuffer);
    let offset = 0;
    
    for (let i = 0; i < pcmData.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, pcmData[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const decodeAudioData = async (
    audioData: ArrayBuffer,
    context: AudioContext,
    sampleRate: number,
    channels: number
  ): Promise<AudioBuffer> => {
    const audioBuffer = context.createBuffer(channels, audioData.byteLength / 2, sampleRate);
    const view = new DataView(audioData);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = view.getInt16(i * 2, true) / 0x7FFF;
    }
    
    return audioBuffer;
  };

  const initSession = useCallback(async () => {
    if (!localApiKey) return;

    const client = new GoogleGenAI({ apiKey: localApiKey });
    
    try {
      const contextData = createContextData();
      const systemPrompt = createSystemPrompt();
      
      const session = await client.live.connect({
        model: "gemini-2.5-flash-preview-native-audio-dialog",
        callbacks: {
          onopen: () => {
            setStatus("Connected");
            setError("");
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData;
            
            if (audio) {
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContext.currentTime
              );
              
              try {
                const audioData = Uint8Array.from(atob(audio.data), c => c.charCodeAt(0));
                const audioBuffer = await decodeAudioData(
                  audioData.buffer,
                  outputAudioContext,
                  24000,
                  1
                );
                
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputGainRef.current!);
                source.addEventListener('ended', () => {
                  audioSourcesRef.current.delete(source);
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
              } catch (err) {
                console.error("Error playing audio:", err);
              }
            }
            
            if (message.serverContent?.interrupted) {
              for (const source of audioSourcesRef.current) {
                source.stop();
              }
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            setError(e.message);
            setStatus("Error occurred");
          },
          onclose: (e: CloseEvent) => {
            setStatus(`Connection closed: ${e.reason}`);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Orus" } },
          },
          systemInstruction: {
            parts: [
              {
                text: `${systemPrompt}\n\nContext: ${contextData}`,
              },
            ],
          },
        },
      });
      
      sessionRef.current = session;
    } catch (err) {
      console.error("Error initializing session:", err);
      setError(`Failed to initialize session: ${err}`);
    }
  }, [localApiKey, chatType, propertyData, propertiesData]);

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
      }
    }

    if (propertiesData && Array.isArray(propertiesData) && propertiesData.length > 0) {
      return `Available Properties Database:
Total Properties: ${propertiesData.length}

Property Listings:
${propertiesData.slice(0, 10).map((property, index) =>
  `${index + 1}. ${property.title || 'Untitled Property'}
   - Price: ${property.price || 'N/A'} ${property.currency || ''}
   - Area: ${property.area || 'N/A'}m²
   - Location: ${property.location || property.address || 'N/A'}
   - Type: ${property.ad_type || property.type || 'N/A'}
   - Bedrooms: ${property.bedrooms || property.rooms || 'N/A'}
   - Bathrooms: ${property.bathrooms || 'N/A'}`
).join('\n\n')}`;
    }

    return "I'm a real estate AI assistant. I can help you with property-related questions, market information, and general real estate advice.";
  };

  const createSystemPrompt = () => {
    return `You are a helpful real estate AI assistant called 'Casa AI' for a platform called 'Aqar Zone' in Saudi Arabia.

Always respond in Arabic if the user speaks Arabic, otherwise respond in English.
Be friendly, professional, and helpful.
Keep responses concise and conversational for voice interaction.
${chatType === "property" ? 'Focus on the specific property details when answering questions.' : 'Use the provided property data to give specific recommendations when users ask about properties.'}
When mentioning properties, include key details like price, location, and size.`;
  };

  const startRecording = async () => {
    if (isRecording || !sessionRef.current) return;

    await inputAudioContext.resume();
    setStatus("Requesting microphone access...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        },
      });

      mediaStreamRef.current = stream;
      setStatus("🔴 Recording... Speak now.");

      const sourceNode = inputAudioContext.createMediaStreamSource(stream);
      const scriptProcessor = inputAudioContext.createScriptProcessor(256, 1, 1);

      scriptProcessor.onaudioprocess = (event) => {
        if (!isRecording) return;
        
        const inputBuffer = event.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);
        
        if (sessionRef.current) {
          const audioBlob = createBlob(pcmData);
          sessionRef.current.sendRealtimeInput({ media: audioBlob as any });
        }
      };

      sourceNode.connect(inputGainRef.current!);
      sourceNode.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContext.destination);

      processorRef.current = {
        context: inputAudioContext,
        sourceNode,
        scriptProcessor,
        gainNode: inputGainRef.current!,
      };

      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setStatus(`Error: ${err}`);
      setError(`Failed to start recording: ${err}`);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    setIsRecording(false);
    setStatus("Recording stopped. Click Start to begin again.");

    if (processorRef.current) {
      processorRef.current.scriptProcessor?.disconnect();
      processorRef.current.sourceNode?.disconnect();
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const resetSession = async () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setStatus("Session reset. Reconnecting...");
    await initSession();
  };

  const handleBack = () => {
    cleanup();
    navigate(-1);
  };

  const isLoading = chatType === "global" ? isPropertiesLoading : isPropertyLoading;
  const hasError = chatType === "global" ? propertiesError : propertyError;

  return (
    <div className="min-h-screen bg-background relative">
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
                  ? (propertyData?.title || "Live Property Voice Chat")
                  : "Live AI Voice Assistant"
                }
              </h1>
              <p className="text-sm text-muted-foreground">
                {chatType === "property" 
                  ? "Real-time voice conversation about this property"
                  : "Real-time voice conversation about our properties"
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
                  Enter your Gemini API Key
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  API key is required for live voice chat
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={initSession} disabled={!localApiKey}>
                  Connect
                </Button>
              </div>
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

          {/* Error State */}
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

          {/* Voice Chat Interface */}
          {localApiKey && !isLoading && (
            <div className="space-y-8">
              {/* Status Display */}
              <div className="text-center">
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {isRecording && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <span className="text-lg font-medium">
                      {status}
                    </span>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                  )}
                  
                  {/* Audio Visualizer Placeholder */}
                  <div className="h-24 bg-muted rounded-lg flex items-center justify-center">
                    {isRecording ? (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 bg-primary rounded-full animate-pulse"
                            style={{
                              height: `${20 + Math.random() * 40}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        Voice visualization will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetSession}
                  disabled={isRecording}
                  className="h-16 w-16 rounded-full"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={isRecording || !sessionRef.current}
                  className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <div className="w-8 h-8 bg-white rounded-full" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="h-16 w-16 rounded-full"
                >
                  <Square className="h-6 w-6" />
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Click the red button to start recording, speak naturally, and AI will respond with voice.
                </p>
                <p className="mt-2">
                  Use the square button to stop recording, or the reset button to start a new conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceChatPage;