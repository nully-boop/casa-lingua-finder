
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, Sparkles } from "lucide-react";

interface Agent {
  name: string;
  nameAr: string;
  phone: string;
  email: string;
  image: string;
}

interface AgentSidebarProps {
  agent: Agent;
  language: string;
  onContact: () => void;
  onChat: () => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({
  agent,
  language,
  onContact,
  onChat,
}) => (
  <Card className="sticky top-8">
    <CardContent className="p-6">
      <div className="text-center mb-6">
        <img
          src={agent.image}
          alt={language === "ar" ? agent.nameAr : agent.name}
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-semibold mb-1">
          {language === "ar" ? agent.nameAr : agent.name}
        </h3>
        <p className="text-muted-foreground">
          {language === "ar" ? "وكيل عقاري" : "Real Estate Agent"}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{agent.phone}</span>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{agent.email}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={onContact} className="w-full">
          <Phone className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {language === "ar" ? "اتصل الآن" : "Call Now"}
        </Button>
        <Button
          variant="outline"
          onClick={onContact}
          className="w-full"
        >
          <Mail className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {language === "ar" ? "إرسال رسالة" : "Send Message"}
        </Button>
        <Button variant="outline" className="w-full">
          <Calendar className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {language === "ar" ? "حجز موعد" : "Schedule Visit"}
        </Button>
        <Button variant="secondary" onClick={onChat} className="w-full">
          <Sparkles className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {language === "ar" ? "الدردشة مع الذكاء الاصطناعي" : "Chat with AI"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default AgentSidebar;
