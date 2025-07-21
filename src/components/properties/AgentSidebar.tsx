import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import IOffice from "@/interfaces/IOffice";

interface Agent {
  owner: IOffice;
}

const AgentSidebar: React.FC<Agent> = ({ owner }) => {
  const { language } = useLanguage();

  const onContact = () => {
    alert(
      language === "ar"
        ? "سيتم التواصل مع الوكيل قريبا."
        : "The agent will be contacted soon."
    );
  };
  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <Link to={`/office/${owner.id}`} className="block">
            <img
              src={owner.image?.url}
              alt={owner.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover hover:opacity-80 transition-opacity cursor-pointer"
            />
            <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors cursor-pointer">
              {owner.name}
            </h3>
          </Link>
          <p className="text-muted-foreground">{owner.type}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{owner.phone}</span>
          </div>
          {/* <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{agent.email}</span>
          </div> */}
        </div>

        <div className="space-y-3">
          <Button onClick={onContact} className="w-full">
            <Phone className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === "ar" ? "اتصل الآن" : "Call Now"}
          </Button>
          <Button variant="outline" onClick={onContact} className="w-full">
            <Mail className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === "ar" ? "إرسال رسالة" : "Send Message"}
          </Button>
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === "ar" ? "حجز موعد" : "Schedule Visit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentSidebar;
