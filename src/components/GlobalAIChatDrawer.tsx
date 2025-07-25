import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Loader2, AudioLines } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/contexts/LanguageContext";
import { runMultiPropertyChat } from "@/services/geminiAPI";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";

interface GlobalAIChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

const GlobalAIChatDrawer: React.FC<GlobalAIChatDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch properties data
  const {
    data: propertiesData,
    isLoading: isPropertiesLoading,
    error: propertiesError,
  } = useQuery<IProperty[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await propertiesAPI.getProperties();
      return response.data.data; // Extract the actual properties array
    },
  });

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleVoiceChatNavigation = () => {
    // Navigate to voice chat page with API key and type
    const params = new URLSearchParams({
      apiKey: apiKey,
      type: "global",
    });
    navigate(`/voice-chat?${params.toString()}`);
    onOpenChange(false); // Close the drawer
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let fullResponse = "";

    // Add an empty AI message that we'll update with streaming content
    const aiMessageIndex = messages.length + 1; // +1 because we just added user message
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    try {
      await runMultiPropertyChat(
        apiKey,
        Array.isArray(propertiesData) ? propertiesData : [],
        input,
        (chunk: string) => {
          fullResponse += chunk;
          // Update the AI message with accumulated response
          setMessages((prev) => {
            const newMessages = [...prev];
            if (newMessages[aiMessageIndex]) {
              newMessages[aiMessageIndex] = {
                sender: "ai",
                text: fullResponse,
              };
            }
            return newMessages;
          });
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        sender: "ai",
        text:
          t("aiChat.error") ||
          "Sorry, I encountered an error. Please try again.",
      };
      // Replace the empty AI message with error message
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[aiMessageIndex]) {
          newMessages[aiMessageIndex] = errorMessage;
        } else {
          newMessages.push(errorMessage);
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="text-center">
            <DrawerTitle>{t("aiChat.title")}</DrawerTitle>
            <DrawerDescription>
              {t("aiChat.globalDescription") || "Ask me about our properties!"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            {/* Unified Chat Interface */}
            <div className="space-y-4">
              <Input
                type="password"
                placeholder={t("aiChat.apiKeyPlaceholder")}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="border-primary/50"
              />

              <ScrollArea
                className="h-[40vh] w-full rounded-md border p-4"
                ref={scrollAreaRef}
              >
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                      <p>{t("aiChat.startConversation")}</p>
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        msg.sender === "user" ? "justify-end" : ""
                      }`}
                    >
                      {msg.sender === "ai" && (
                        <img
                          src="/icons/siri-stroke-rounded (3) (1).png"
                          alt="AI Chat"
                          className="h-6 w-6 flex-shrink-0"
                        />
                      )}
                      <div
                        className={`rounded-lg p-3 text-sm max-w-lg break-words ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.sender === "ai" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ node: _node, ...props }) => (
                                <p className="mb-2 last:mb-0" {...props} />
                              ),
                              ul: ({ node: _node, ...props }) => (
                                <ul
                                  className="list-disc list-inside"
                                  {...props}
                                />
                              ),
                              ol: ({ node: _node, ...props }) => (
                                <ol
                                  className="list-decimal list-inside"
                                  {...props}
                                />
                              ),
                              li: ({ node: _node, ...props }) => (
                                <li className="mb-1" {...props} />
                              ),
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        ) : (
                          msg.text
                        )}
                      </div>
                      {msg.sender === "user" && (
                        <User className="h-6 w-6 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <img
                        src="/icons/siri-stroke-rounded (3) (1).png"
                        alt="AI Chat"
                        className="h-6 w-6 flex-shrink-0"
                      />{" "}
                      <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder={t("aiChat.inputPlaceholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading || isPropertiesLoading}
                  className="flex-1"
                />
                {/* Dynamic Button: Voice Chat or Send */}
                {apiKey.trim() && !input.trim() ? (
                  <Button
                    onClick={handleVoiceChatNavigation}
                    disabled={isLoading || isPropertiesLoading}
                    size="icon"
                    variant="ai"
                    className="shrink-0 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 animate-in fade-in slide-in-from-right"
                  >
                    <AudioLines className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      isLoading ||
                      !input.trim() ||
                      !apiKey.trim() ||
                      isPropertiesLoading
                    }
                    size="icon"
                  >
                    {isLoading || isPropertiesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              {isPropertiesLoading && (
                <div className="text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  {t("common.loadingProperties") ||
                    "Loading properties data..."}
                </div>
              )}
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t("common.close")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GlobalAIChatDrawer;
