
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Building, Sun, Moon, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const { t, user, isAuthenticated, language, setLanguage } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  // Handlers for language and theme toggle (for unauthenticated users)
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleToggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  // Fallback avatar initials
  const getAvatarInitials = () => {
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    }
    return "U";
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
            {isAuthenticated && user?.user_type === "seller" && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
              >
                <span>{t("nav.dashboard")}</span>
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="px-4"
                >
                  <Link to="/login">{t("nav.login") || "Login"}</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="px-4"
                >
                  <Link to="/register">{t("nav.register") || "Register"}</Link>
                </Button>
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
              </>
            ) : (
              // Show profile avatar that triggers sidebar when authenticated
              <SidebarTrigger asChild>
                <button className="p-0 border-0 bg-transparent">
                  <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarFallback>
                      {getAvatarInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </SidebarTrigger>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
