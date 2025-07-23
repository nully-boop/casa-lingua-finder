import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './VoiceChat.css';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

// Types
interface VoiceChatProps {
  geminiApiKey: string;
  contextData?: string;
  systemPrompt?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  theme?: 'light' | 'dark';
  language?: 'ar' | 'en';
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
  onError?: (error: string) => void;
  onUserMessage?: (message: string) => void;
  onAIResponse?: (response: string) => void;
  className?: string;
}

enum VoiceService {
  RESPONSIVE_VOICE = 'RESPONSIVE_VOICE',
  BROWSER = 'BROWSER'
}

interface VoiceConfig {
  service: VoiceService;
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  voiceId?: string;
}

const VoiceChat: React.FC<VoiceChatProps> = ({
  geminiApiKey,
  contextData = '',
  systemPrompt = 'You are a helpful AI assistant. Respond in Arabic if the user speaks Arabic, otherwise respond in English.',
  position = 'bottom-right',
  theme = 'dark',
  language = 'ar',
  onConversationStart,
  onConversationEnd,
  onError,
  onUserMessage,
  onAIResponse,
  className = ''
}) => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUserText, setCurrentUserText] = useState('');
  const [lastAiResponse, setLastAiResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const geminiRef = useRef<GoogleGenerativeAI | null>(null);
  const chatSessionRef = useRef<any>(null);
  const mountedRef = useRef(true);

  // Voice configuration
  const [voiceConfig] = useState<VoiceConfig>({
    service: VoiceService.RESPONSIVE_VOICE,
    language: language === 'ar' ? 'ar-SA' : 'en-US',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceId: 'Arabic Female'
  });

  // Initialize Gemini AI
  useEffect(() => {
    if (!geminiApiKey) {
      setError('Gemini API key is required');
      return;
    }

    try {
      geminiRef.current = new GoogleGenerativeAI(geminiApiKey);
      const model = geminiRef.current.getGenerativeModel({
        model: "gemini-2.5-pro",
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: `You are a helpful real estate assistant called 'Casa AI' for a platform called 'Aqar Zone'.
              You can help users find properties, answer questions about real estate, and provide guidance.
              Always respond in Arabic if the user speaks Arabic, otherwise respond in English.
              Be friendly, professional, and helpful.
              Use the provided context to give relevant and accurate information about available properties.
              Keep responses concise and conversational for voice interaction.`,
            },
          ],
        },
      });
      chatSessionRef.current = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });
      setIsInitialized(true);
    } catch (error) {
      setError('Failed to initialize AI');
      onError?.('Failed to initialize AI');
    }
  }, [geminiApiKey, onError]);

  // Check ResponsiveVoice availability on mount
  useEffect(() => {
    const checkResponsiveVoice = () => {
      if (typeof window !== 'undefined') {
        if ((window as any).responsiveVoice) {
          console.log('✅ ResponsiveVoice is loaded');
          const rv = (window as any).responsiveVoice;
          if (rv.voiceSupport && rv.voiceSupport()) {
            console.log('✅ ResponsiveVoice voice support confirmed');
          } else {
            console.log('⚠️ ResponsiveVoice loaded but voice support not confirmed');
          }
        } else {
          console.log('❌ ResponsiveVoice not found on window object');
        }
      }
    };

    // Check immediately
    checkResponsiveVoice();

    // Also check after a delay in case it's still loading
    const timer = setTimeout(checkResponsiveVoice, 2000);

    // Check browser audio capabilities
    console.log('🔊 Browser audio capabilities:');
    console.log('- speechSynthesis available:', 'speechSynthesis' in window);
    console.log('- webkitSpeechRecognition available:', 'webkitSpeechRecognition' in window);
    console.log('- SpeechRecognition available:', 'SpeechRecognition' in window);

    return () => clearTimeout(timer);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = voiceConfig.language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (!mountedRef.current) return;
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!mountedRef.current) return;

      // Don't process speech recognition if AI is currently speaking
      if (isSpeaking) {
        console.log('🔇 Ignoring speech recognition while AI is speaking');
        return;
      }

      if (event.results && event.results.length > 0) {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (transcript) {
          // Check if this transcript is similar to the last AI response (to prevent feedback)
          const lastResponse = lastAiResponse.toLowerCase().trim();
          const currentTranscript = transcript.toLowerCase().trim();

          // Simple similarity check - if transcript contains significant portion of AI response, ignore it
          if (lastResponse && lastResponse.length > 10 && currentTranscript.includes(lastResponse.substring(0, 20))) {
            console.log('🔇 Ignoring transcript that seems to be AI feedback:', transcript);
            return;
          }

          console.log('🎤 User speech recognized:', transcript);
          setCurrentUserText(transcript);
          setIsProcessing(true);

          // Stop listening while processing to prevent feedback
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }

          handleUserInput(transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (!mountedRef.current) return;
      console.error('🎤 Speech recognition error:', event.error);
      setIsListening(false);

      // Only set error for critical issues
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.');
      }
    };

    recognition.onend = () => {
      if (!mountedRef.current) return;
      console.log('🎤 Speech recognition ended');
      setIsListening(false);

      // Simple auto-restart if still open and not processing
      if (isOpen && !isProcessing) {
        setTimeout(() => {
          if (mountedRef.current && isOpen && !isProcessing && recognitionRef.current) {
            try {
              console.log('🔄 Auto-restarting speech recognition...');
              recognitionRef.current.start();
              setIsListening(true);
            } catch (restartError) {
              console.warn('⚠️ Failed to auto-restart recognition:', restartError);
            }
          }
        }, 1000);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isOpen, isProcessing, isSpeaking, voiceConfig.language]);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if (!text || !mountedRef.current) return;

    // Clean the text for speech synthesis
    const cleanText = text
      .replace(/[*_`#]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    console.log('🎤 Attempting to speak:', cleanText);
    setIsSpeaking(true);

    // Try ResponsiveVoice first
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      const responsiveVoice = (window as any).responsiveVoice;
      console.log('✅ ResponsiveVoice is available');

      // Check if ResponsiveVoice is ready
      if (responsiveVoice.voiceSupport()) {
        console.log('✅ ResponsiveVoice voice support confirmed');

        console.log('🎵 ResponsiveVoice settings:', {
          text: cleanText,
          voice: voiceConfig.voiceId || 'Arabic Female',
          rate: voiceConfig.rate,
          pitch: voiceConfig.pitch,
          volume: voiceConfig.volume
        });

        responsiveVoice.speak(cleanText, voiceConfig.voiceId || 'Arabic Female', {
          rate: voiceConfig.rate,
          pitch: voiceConfig.pitch,
          volume: voiceConfig.volume,
          onstart: () => {
            console.log('🔊 ResponsiveVoice started speaking');
          },
          onend: () => {
            console.log('✅ ResponsiveVoice finished speaking');
            if (mountedRef.current) {
              setIsSpeaking(false);
            }
          },
          onerror: (error: any) => {
            console.error('❌ ResponsiveVoice error:', error);
            if (mountedRef.current) {
              setIsSpeaking(false);
              speakWithBrowser(cleanText);
            }
          }
        });
      } else {
        console.log('⚠️ ResponsiveVoice not ready, using browser speech');
        speakWithBrowser(cleanText);
      }
    } else {
      console.log('⚠️ ResponsiveVoice not available, using browser speech');
      speakWithBrowser(cleanText);
    }
  }, [voiceConfig, isOpen]);

  // Handle user input
  const handleUserInput = useCallback(async (text: string) => {
    if (!chatSessionRef.current || !mountedRef.current) return;

    // Call the user message callback
    onUserMessage?.(text);

    try {
      const fullPrompt = `${systemPrompt}\n\nContext: ${contextData}\n\nUser: ${text}`;
      const result = await chatSessionRef.current.sendMessage(fullPrompt);
      const response = result.response.text();

      if (mountedRef.current) {
        console.log('🤖 AI Response received:', response);
        setLastAiResponse(response);
        setIsProcessing(false);

        console.log('🎵 About to call speak function...');
        speak(response);

        // Call the AI response callback
        onAIResponse?.(response);
      }
    } catch (error) {
      if (mountedRef.current) {
        setIsProcessing(false);
        setError('Failed to get AI response');
        onError?.('Failed to get AI response');
      }
    }
  }, [systemPrompt, contextData, onError, onUserMessage, onAIResponse, speak]);

  // Test function to verify speech is working
  const testSpeak = useCallback(() => {
    const testText = "مرحباً، هذا اختبار للصوت";
    console.log('🧪 Testing speech with:', testText);

    // Test ResponsiveVoice directly
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      const responsiveVoice = (window as any).responsiveVoice;
      console.log('🧪 Testing ResponsiveVoice directly...');

      responsiveVoice.speak(testText, 'Arabic Female', {
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8,
        onstart: () => console.log('🧪 Direct ResponsiveVoice test started'),
        onend: () => console.log('🧪 Direct ResponsiveVoice test ended'),
        onerror: (error: any) => console.error('🧪 Direct ResponsiveVoice test error:', error)
      });
    } else {
      console.log('🧪 ResponsiveVoice not available, testing browser speech...');
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.lang = 'ar-SA';
      utterance.onstart = () => console.log('🧪 Browser speech test started');
      utterance.onend = () => console.log('🧪 Browser speech test ended');
      utterance.onerror = (error) => console.error('🧪 Browser speech test error:', error);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Browser speech synthesis fallback
  const speakWithBrowser = useCallback((text: string) => {
    console.log('🔊 Using browser speech synthesis for:', text);

    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech synthesis not supported in this browser');
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceConfig.language;
    utterance.rate = voiceConfig.rate;
    utterance.pitch = voiceConfig.pitch;
    utterance.volume = voiceConfig.volume;

    utterance.onstart = () => {
      console.log('🔊 Browser speech started');
    };

    utterance.onend = () => {
      console.log('✅ Browser speech finished');
      if (mountedRef.current) {
        setIsSpeaking(false);
      }
    };

    utterance.onerror = (error) => {
      console.error('❌ Browser speech error:', error);
      if (mountedRef.current) {
        setIsSpeaking(false);
      }
    };

    console.log('🎵 Starting browser speech synthesis...');
    window.speechSynthesis.speak(utterance);
  }, [voiceConfig, isOpen]);

  // Start conversation
  const startConversation = useCallback(() => {
    if (!isInitialized) {
      setError('AI not initialized');
      return;
    }

    setIsOpen(true);
    setError(null);
    setCurrentUserText('');
    setLastAiResponse('');
    onConversationStart?.();

    // Start listening
    setTimeout(() => {
      if (recognitionRef.current && mountedRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setError('Failed to start speech recognition');
        }
      }
    }, 500);
  }, [isInitialized, onConversationStart]);

  // End conversation
  const endConversation = useCallback(() => {
    setIsOpen(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);

    // Stop recognition and speech
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if ((window as any).responsiveVoice) {
      (window as any).responsiveVoice.cancel();
    }

    onConversationEnd?.();
  }, [onConversationEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      endConversation();
    };
  }, [endConversation]);

  // Get status text
  const getStatusText = () => {
    if (language === 'ar') {
      if (isProcessing) return 'جاري التفكير...';
      if (isSpeaking) return 'يتحدث المساعد...';
      if (isListening) return 'أستمع إليك...';
      if (isOpen) return 'اضغط للتحدث';
      return 'ابدأ المحادثة الصوتية';
    } else {
      if (isProcessing) return 'Thinking...';
      if (isSpeaking) return 'AI Speaking...';
      if (isListening) return 'Listening...';
      if (isOpen) return 'Click to speak';
      return 'Start Voice Chat';
    }
  };

  // Get orb state
  const getOrbState = () => {
    if (isProcessing) return 'processing';
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  return (
    <div className={`voice-chat-container ${className}`}>
      {/* Voice Chat Interface */}
      <div className="voice-chat-interface">
        {/* Central Orb */}
        <div className="orb-container">
          <div
            className={`voice-orb ${getOrbState()}`}
            onClick={isOpen ? undefined : startConversation}
            style={{ cursor: isOpen ? 'default' : 'pointer' }}
          >
            <div className="orb-core">
              <div className="orb-inner"></div>
            </div>

            {/* Animations */}
            {isListening && (
              <>
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="pulse-ring ring-3"></div>
              </>
            )}

            {isSpeaking && (
              <div className="speaking-waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
                <div className="wave wave-4"></div>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="status-section">
          <p className="status-text">{getStatusText()}</p>

          {/* Conversation */}
          {(currentUserText || lastAiResponse) && (
            <div className="conversation-text">
              {currentUserText && (
                <div className="user-text">
                  <span className="label">أنت:</span>
                  <span className="text">{currentUserText}</span>
                </div>
              )}
              {lastAiResponse && (
                <div className="ai-text">
                  <span className="label">المساعد:</span>
                  <span className="text">{lastAiResponse}</span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {/* Controls */}
        {isOpen && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              className="end-button"
              onClick={endConversation}
              aria-label="إنهاء المحادثة"
            >
              إنهاء
            </button>
            <button
              type="button"
              className="end-button"
              onClick={testSpeak}
              aria-label="اختبار الصوت"
              style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
            >
              اختبار الصوت
            </button>
            <button
              type="button"
              className="end-button"
              onClick={() => {
                console.log('🔊 Testing browser speech synthesis...');
                const utterance = new SpeechSynthesisUtterance('Hello, this is a test');
                utterance.onstart = () => console.log('🔊 Browser speech started');
                utterance.onend = () => console.log('✅ Browser speech ended');
                utterance.onerror = (error) => console.error('❌ Browser speech error:', error);
                window.speechSynthesis.speak(utterance);
              }}
              aria-label="اختبار المتصفح"
              style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}
            >
              اختبار المتصفح
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;