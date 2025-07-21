import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";

const Footer = () => {
  const { language } = useLanguage(); // Prefixed isRTL

  const footerLinks = {
    en: {
      quickLinks: [
        { name: "Properties", href: "/properties" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Blog", href: "/blog" },
      ],
      services: [
        { name: "Buy Property", href: "/properties?type=sale" },
        { name: "Rent Property", href: "/properties?type=rent" },
        { name: "Sell Property", href: "/add-property" },
        { name: "Property Management", href: "/services" },
      ],
      legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
    ar: {
      quickLinks: [
        { name: "العقارات", href: "/properties" },
        { name: "من نحن", href: "/about" },
        { name: "اتصل بنا", href: "/contact" },
        { name: "المدونة", href: "/blog" },
      ],
      services: [
        { name: "شراء عقار", href: "/properties?type=sale" },
        { name: "استئجار عقار", href: "/properties?type=rent" },
        { name: "بيع عقار", href: "/add-property" },
        { name: "إدارة العقارات", href: "/services" },
      ],
      legal: [
        { name: "سياسة الخصوصية", href: "/privacy" },
        { name: "شروط الخدمة", href: "/terms" },
        { name: "سياسة ملفات تعريف الارتباط", href: "/cookies" },
        { name: "إخلاء المسؤولية", href: "/disclaimer" },
      ],
    },
  };

  const currentLinks = footerLinks[language as keyof typeof footerLinks];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Aqar Zone</span>
            </div>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "نظام إدارة العقارات الحديث ثنائي اللغة. نساعدك في العثور على منزل أحلامك أو بيع عقارك بسهولة."
                : "Modern bilingual property management system. We help you find your dream home or sell your property with ease."}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Button size="sm" variant="outline" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {currentLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === "ar" ? "خدماتنا" : "Our Services"}
            </h3>
            <ul className="space-y-2">
              {currentLinks.services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === "ar" ? "اتصل بنا" : "Contact Us"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {language === "ar"
                    ? "دمشق، الجمهورية العربية السورية"
                    : "Damascus, Syrian Arab Republic"}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+963 991 234 567</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  info@aqarzone.com
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">
                {language === "ar" ? "النشرة الإخبارية" : "Newsletter"}
              </h4>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input
                  placeholder={
                    language === "ar" ? "البريد الإلكتروني" : "Email address"
                  }
                  className="flex-1"
                />
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aqar Zone.{" "}
            {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
          <div className="flex space-x-6 rtl:space-x-reverse text-sm">
            {currentLinks.legal.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
