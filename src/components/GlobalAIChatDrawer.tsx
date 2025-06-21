import React, { useState, useRef, useEffect } from "react";
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
import { Send, Bot, User, Loader2 } from "lucide-react";
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

export const GlobalAIChatDrawer: React.FC<GlobalAIChatDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch properties data
  const { data: propertiesData, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties-for-ai"],
    queryFn: async () => {
      const response = await propertiesAPI.getProperties();
      return response.data.data as IProperty[];
    },
    enabled: open, // Only fetch when drawer is open
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey.trim() || isLoading || !propertiesData) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage, { sender: "ai", text: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      await runMultiPropertyChat(apiKey, propertiesData, userMessage.text, (chunk) => {
        setMessages((prev) => {
          const lastMessageIndex = prev.length - 1;
          const updatedMessages = [...prev];
          updatedMessages[lastMessageIndex].text += chunk;
          return updatedMessages;
        });
      });
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage =
        "Sorry, I encountered an error. Please check your API key and try again.";
      setMessages((prev) => {
        const lastMessageIndex = prev.length - 1;
        const updatedMessages = [...prev];
        updatedMessages[lastMessageIndex].text = errorMessage;
        return updatedMessages;
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
                      <Bot className="h-6 w-6 flex-shrink-0" />
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
                {isLoading && messages[messages.length - 1]?.text === "" && (
                  <div className="flex items-start gap-3">
                    <Bot className="h-6 w-6 flex-shrink-0" />
                    <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex items-center gap-2">
              <Input
                placeholder={t("aiChat.inputPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading || isPropertiesLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !apiKey.trim() || isPropertiesLoading}
              >
                {isLoading || isPropertiesLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isPropertiesLoading && (
              <div className="text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                {t("common.loadingProperties") || "Loading properties data..."}
              </div>
            )}
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