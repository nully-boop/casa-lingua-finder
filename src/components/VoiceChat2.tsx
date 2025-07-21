import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Session } from "@google/genai";
import './VoiceChat.css';

// Audio utility functions for live chat
const encode = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const createBlob = (data: Float32Array) => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // convert float32 -1 to 1 to int16 -32768 to 32767
    int16[i] = data[i] * 32768;
  }

  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const buffer = ctx.createBuffer(
    numChannels,
    data.length / 2 / numChannels,
    sampleRate,
  );

  const dataInt16 = new Int16Array(data.buffer);
  const l = dataInt16.length;
  const dataFloat32 = new Float32Array(l);
  for (let i = 0; i < l; i++) {
    dataFloat32[i] = dataInt16[i] / 32768.0;
  }

  // Extract interleaved channels
  if (numChannels === 1) {
    buffer.copyToChannel(dataFloat32, 0);
  } else {
    for (let i = 0; i < numChannels; i++) {
      const channel = dataFloat32.filter(
        (_, index) => index % numChannels === i,
      );
      buffer.copyToChannel(channel, i);
    }
  }

  return buffer;
};

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



const VoiceChat2: React.FC<VoiceChatProps> = ({
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
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveChatStatus, setLiveChatStatus] = useState('');

  // Refs
  const mountedRef = useRef(true);
  const liveClientRef = useRef<GoogleGenAI | null>(null);
  const liveSessionRef = useRef<Session | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<GainNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());



  // Initialize Live Chat Audio
  const initLiveChatAudio = useCallback(() => {
    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000
    });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000
    });

    if (inputAudioContextRef.current) {
      inputNodeRef.current = inputAudioContextRef.current.createGain();
    }

    if (outputAudioContextRef.current) {
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);
      nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
    }
  }, []);

  // Initialize Live Chat Client
  const initLiveChatClient = useCallback(async () => {
    if (!geminiApiKey) {
      setError('Gemini API key is required for live chat');
      return;
    }

    try {
      initLiveChatAudio();

      liveClientRef.current = new GoogleGenAI({
        apiKey: geminiApiKey,
      });

      await initLiveChatSession();
    } catch (error) {
      console.error('Failed to initialize live chat client:', error);
      setError('Failed to initialize live chat');
    }
  }, [geminiApiKey, initLiveChatAudio]);

  // Initialize Live Chat Session
  const initLiveChatSession = useCallback(async () => {
    if (!liveClientRef.current || !outputAudioContextRef.current) return;

    const model = 'gemini-2.5-flash-preview-native-audio-dialog';

    try {
      liveSessionRef.current = await liveClientRef.current.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            setLiveChatStatus('Live chat connected');
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData;

            if (audio && outputAudioContextRef.current && outputNodeRef.current) {
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContextRef.current.currentTime,
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                outputAudioContextRef.current,
                24000,
                1,
              );

              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNodeRef.current);

              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            setError(e.message);
          },
          onclose: (e: CloseEvent) => {
            setLiveChatStatus('Live chat closed: ' + e.reason);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orus' } },
          },
        },
      });
    } catch (e) {
      console.error('Failed to initialize live chat session:', e);
      setError('Failed to connect to live chat');
    }
  }, []);

  // Start Live Chat Recording
  const startLiveChatRecording = useCallback(async () => {
    if (isRecording || !inputAudioContextRef.current || !liveSessionRef.current || !inputNodeRef.current) {
      return;
    }

    try {
      await inputAudioContextRef.current.resume();
      setLiveChatStatus('Requesting microphone access...');

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      setLiveChatStatus('Microphone access granted. Starting live chat...');

      sourceNodeRef.current = inputAudioContextRef.current.createMediaStreamSource(
        mediaStreamRef.current,
      );
      sourceNodeRef.current.connect(inputNodeRef.current);

      const bufferSize = 256;
      scriptProcessorNodeRef.current = inputAudioContextRef.current.createScriptProcessor(
        bufferSize,
        1,
        1,
      );

      scriptProcessorNodeRef.current.onaudioprocess = (audioProcessingEvent) => {
        if (!isRecording || !liveSessionRef.current) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);

        liveSessionRef.current.sendRealtimeInput({ media: createBlob(pcmData) });
      };

      sourceNodeRef.current.connect(scriptProcessorNodeRef.current);
      scriptProcessorNodeRef.current.connect(inputAudioContextRef.current.destination);

      setIsRecording(true);
      setLiveChatStatus('🔴 Live chat recording... Speak now!');
    } catch (err: any) {
      console.error('Error starting live chat recording:', err);
      setLiveChatStatus(`Error: ${err.message}`);
      stopLiveChatRecording();
    }
  }, [isRecording]);

  // Stop Live Chat Recording
  const stopLiveChatRecording = useCallback(() => {
    if (!isRecording && !mediaStreamRef.current && !inputAudioContextRef.current) return;

    setLiveChatStatus('Stopping live chat recording...');
    setIsRecording(false);

    if (scriptProcessorNodeRef.current && sourceNodeRef.current && inputAudioContextRef.current) {
      scriptProcessorNodeRef.current.disconnect();
      sourceNodeRef.current.disconnect();
    }

    scriptProcessorNodeRef.current = null;
    sourceNodeRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setLiveChatStatus('Live chat recording stopped. Click Start to begin again.');
  }, [isRecording]);

  // Reset Live Chat Session
  const resetLiveChatSession = useCallback(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
    }
    initLiveChatSession();
    setLiveChatStatus('Live chat session reset.');
  }, [initLiveChatSession]);













  // Start conversation (Live Chat Mode)
  const startConversation = useCallback(() => {
    if (!geminiApiKey) {
      setError('Gemini API key is required');
      return;
    }

    setIsOpen(true);
    setError(null);
    initLiveChatClient();
  }, [geminiApiKey, initLiveChatClient]);

  // End conversation
  const endConversation = useCallback(() => {
    setIsOpen(false);
    setIsRecording(false);
    setError(null);
    setLiveChatStatus('');

    // Stop live chat recording
    stopLiveChatRecording();

    // Close live chat session
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
    }
  }, [stopLiveChatRecording]);

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
      if (isRecording) return 'تسجيل مباشر... تحدث الآن!';
      if (isOpen) return 'انقر لبدء التسجيل';
      return 'ابدأ المحادثة الصوتية المباشرة';
    } else {
      if (isRecording) return 'Live recording... Speak now!';
      if (isOpen) return 'Click to start recording';
      return 'Start Live Voice Chat';
    }
  };

  // Get orb state
  const getOrbState = () => {
    if (isRecording) return 'listening';
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
            {isRecording && (
              <>
                <div className="pulse-ring ring-1"></div>
                <div className="pulse-ring ring-2"></div>
                <div className="pulse-ring ring-3"></div>
              </>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="status-section">
          <p className="status-text">{getStatusText()}</p>



          {/* Error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {/* Live Chat Controls */}
        {isOpen && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
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
              onClick={resetLiveChatSession}
              disabled={isRecording}
              aria-label="إعادة تعيين الجلسة"
              style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' }}
            >
              إعادة تعيين
            </button>

            <button
              type="button"
              className="end-button"
              onClick={isRecording ? stopLiveChatRecording : startLiveChatRecording}
              aria-label={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
              style={{
                background: isRecording
                  ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                  : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
              }}
            >
              {isRecording ? '⏹️ إيقاف' : '🎤 تسجيل'}
            </button>
          </div>
        )}

        {/* Live Chat Status */}
        {liveChatStatus && (
          <div className="status-section" style={{ marginTop: '10px' }}>
            <p className="status-text" style={{ fontSize: '12px', color: '#888' }}>
              {liveChatStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat2;