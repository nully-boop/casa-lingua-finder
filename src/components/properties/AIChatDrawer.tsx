
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
import IProperty from "@/interfaces/IProperty";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: IProperty;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  open,
  onOpenChange,
  property,
}) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // This is a placeholder for the Gemini API call.
    // We are simulating a response for now.
    setTimeout(() => {
      const aiResponse: Message = {
        sender: "ai",
        text: `This is a simulated AI response about: ${property.title}. You asked: "${userMessage.text}"`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="text-center">
            <DrawerTitle>{t("aiChat.title") || "AI Property Assistant"}</DrawerTitle>
            <DrawerDescription>
              {t("aiChat.description", { title: property.title }) || `Ask anything about "${property.title}".`}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Input
              type="password"
              placeholder={t("aiChat.apiKeyPlaceholder") || "Enter your Gemini API Key here (for testing)"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border-primary/50"
            />
            <ScrollArea className="h-[40vh] w-full rounded-md border p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    <p>{t("aiChat.startConversation") || "Ask a question to get started!"}</p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "justify-end" : ""
                    }`}
                  >
                    {msg.sender === "ai" && <Bot className="h-6 w-6 flex-shrink-0" />}
                    <div
                      className={`rounded-lg p-3 text-sm max-w-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === "user" && <User className="h-6 w-6 flex-shrink-0" />}
                  </div>
                ))}
                {isLoading && (
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
                placeholder={t("aiChat.inputPlaceholder") || "Ask about amenities, neighborhood, etc."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !apiKey.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t("common.close") || "Close"}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

