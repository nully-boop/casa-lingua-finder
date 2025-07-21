import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Globe, AlertTriangle, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { profileAPI } from "@/services/api";
import GlobalAIChatButton from "./buttons/GlobalAIChatButton";

const Header = () => {
  const {
    t,
    user,
    isAuthenticated,
    language,
    setLanguage,
    triggerLanguageAnimation,
  } = useLanguage();
  const { theme, setTheme, isDark, triggerThemeAnimation } = useTheme();

  const hasToken = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return !!parsedUser?.token;
      }
      return false;
    } catch {
      return false;
    }
  };

  const {
    data: profileData,
    isError: isProfileQueryError,
    error: profileQueryError,
  } = useQuery({
    queryKey: ["profile"], // This query key is also used in src/pages/Profile.tsx. Consider if they should be distinct or if this is intentional.
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error(
          "No authentication token found for profile fetch in Header."
        );
      }
      const response = await profileAPI.getProfile();
      return response.user;
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      // Attempt to check for AxiosError-like structure
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) {
        // Specific handling for 401, perhaps logout user or clear token if appropriate here
        console.warn("Profile query in Header received 401, not retrying.");
        return false;
      }
      // For other errors, retry up to 2 times (total 3 attempts)
      return failureCount < 2;
    },
    // staleTime: 5 * 60 * 1000, // Optional: 5 minutes, if profile data doesn't change often
  });

  useEffect(() => {
    if (isProfileQueryError && profileQueryError) {
      console.error(
        "Header profile query error:",
        (profileQueryError as Error).message
      );
      // Here you could also use a toast notification for critical errors if desired,
      // but a subtle UI cue is often better for header elements.
      // e.g., toast({ title: "Profile Error", description: "Could not load profile information.", variant: "destructive" });
    }
  }, [isProfileQueryError, profileQueryError]);

  // Update local user context if profileData is successfully fetched
  // This part depends on how 'user' in LanguageContext is updated.
  // For now, assuming 'user' from LanguageContext is the primary source for display,
  // and this query is for fetching more details or ensuring freshness.
  // If profileData from this query should update the global user state, that logic would be here.

  const handleToggleTheme = (event: React.MouseEvent) => {
    triggerThemeAnimation(event);
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
    }, 150);
  };

  const handleToggleLanguage = () => {
    triggerLanguageAnimation();
    setTimeout(() => {
      setLanguage(language === "en" ? "ar" : "en");
    }, 200);
  };

  const getAvatarInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 rtl:space-x-reverse group transition-all duration-300 hover:scale-105"
            >
              <Building className="h-10 w-10 text-primary group-hover:text-primary/80 transition-all duration-300" />
              <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-all duration-300">
                Aqar Zone
              </span>
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
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Button asChild variant="outline" size="sm" className="px-4">
                    <Link to="/login">{t("auth.login") || "Login"}</Link>
                  </Button>
                  <Button asChild variant="default" size="sm" className="px-4">
                    <Link to="/register">
                      {t("auth.getStarted") || "Get Started"}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleTheme}
                    className="theme-toggle-enhanced relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-md"
                    aria-label={
                      isDark
                        ? t("nav.light") || "Switch to Light"
                        : t("nav.dark") || "Switch to Dark"
                    }
                  >
                    <div className="icon-rotate">
                      {isDark ? (
                        <Sun className="h-5 w-5 transition-all duration-300" />
                      ) : (
                        <Moon className="h-5 w-5 transition-all duration-300" />
                      )}
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleLanguage}
                    className="language-toggle-enhanced relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-md"
                    aria-label={t("nav.language")}
                  >
                    <Globe className="h-5 w-5 transition-all duration-300" />
                    <span className="absolute bottom-0 right-0 text-[8px] font-bold opacity-60">
                      {language.toUpperCase()}
                    </span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-5">
                  {isProfileQueryError && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  {/* AI Chat Button */}
                  <GlobalAIChatButton />

                  <SidebarTrigger asChild>
                    <button className="p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                      <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage
                          src={profileData?.image?.url || user.image?.url}
                          alt={profileData?.name || user.name}
                        />
                        <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
                      </Avatar>
                    </button>
                  </SidebarTrigger>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
