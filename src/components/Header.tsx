
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Building, Sun, Moon, Globe } from "lucide-react"; // Add Sun, Moon, Globe
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";

const Header = () => {
  const { t, user, isAuthenticated, language, setLanguage } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  // Handlers for language and theme toggle
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleToggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Building className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Casa Lingua</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link
              to="/"
              className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
            >
              <span>{t("nav.home")}</span>
            </Link>
            <Link
              to="/properties"
              className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
            >
              <span>{t("nav.properties")}</span>
            </Link>
            {isAuthenticated && user.user_type === "seller" && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
              >
                <span>{t("nav.dashboard")}</span>
              </Link>
            )}
          </nav>

          {/* Actions for NOT authenticated users: Translate and Dark Mode */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleTheme}
                aria-label={isDark ? t("nav.light") || "Switch to Light" : t("nav.dark") || "Switch to Dark"}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleLanguage}
                aria-label={t("nav.language")}
              >
                <Globe className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
