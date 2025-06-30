import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Globe,
  X,
  Building2,
  Heart,
  DollarSign,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authAPI, profileAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAvatarInitials } from "@/func/user";

export const AppSidebar: React.FC = () => {
  const { language, setLanguage, t, isAuthenticated, logout, hasToken, triggerLanguageAnimation } =
    useLanguage();
  const { theme, setTheme, isDark, triggerThemeAnimation } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  const { open, isMobile, toggleSidebar } = useSidebar();

  const handleToggleTheme = (event?: React.MouseEvent) => {
    if (event) {
      triggerThemeAnimation(event);
    }
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

  const handleCurrencyChange = () => {
    const currencies = ["USD", "AED", "SYP"] as const;
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex]);
  };

  const getCurrencyDisplay = () => {
    switch (currency) {
      case "USD": return "$";
      case "AED": return "AED";
      case "SYP": return "SYP";
      default: return currency;
    }
  };

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      const response = await profileAPI.getProfile();
      return response.user;
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  const handleLogout = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const userObj = JSON.parse(userData);
        const token = userObj.token;
        if (token) {
          await authAPI.logout(token);
        }
      }

      toast({
        title: t("toast.logoutSuccess") || "Logout successful",
        description: t("toast.seeYouAgain") || "See you again!",
      });

      localStorage.removeItem("user");
      if (logout) {
        logout();
      }

      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
      toast({
        title: t("toast.logoutFailed") || "Logout failed",
        description: t("toast.error") || "Error happened",
        variant: "destructive",
      });

      localStorage.removeItem("user");
      if (logout) {
        logout();
      }
      navigate("/");
    }
  };

  const sidebarSide = language === "ar" ? "left" : "right";
  const profileImage = profileData?.image?.url;
  return (
    <>
      {/* Overlay Layer (only for desktop when sidebar is open) */}
      {!isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ease-in-out"
          onClick={(e) => {
            // Check if click is outside the sidebar
            const sidebar = document.querySelector("[data-sidebar]");
            if (sidebar && !sidebar.contains(e.target as Node)) {
              toggleSidebar();
            }
          }}
          aria-hidden="true"
        />
      )}

      <Sidebar side={sidebarSide} className="z-20">
        <SidebarHeader>
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="mb-2">
              <AvatarImage src={profileImage} alt={profileData?.name} />
              <AvatarFallback>{getAvatarInitials(profileData)}</AvatarFallback>
            </Avatar>

            <div className="text-sm font-semibold text-center">
              {profileData?.name || "User"}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {profileData?.phone}
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {t("nav.profileActions") || "Profile Actions"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4" />
                      <span>{t("nav.profile") || "Profile"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/favorites">
                      <Heart className="w-4 h-4" />
                      <span>{t("nav.favorites") || "Favorites"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              {t("nav.navigation") || "Navigation"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/owner">
                      <Building2 className="w-4 h-4" />
                      <span>{t("nav.owner") || "Owner Dashboard"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              {t("nav.settings") || "Settings"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/settings">
                      <Settings className="w-4 h-4" />
                      <span>{t("nav.settings") || "Settings"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleToggleLanguage}
                    className="language-toggle-enhanced relative overflow-hidden transition-all duration-300 hover:bg-accent/80"
                  >
                    <Globe className="h-4 w-4 transition-all duration-300" />
                    <span>{t("nav.language") || "Language"}</span>
                    <span className="ml-auto text-xs opacity-60 font-medium">
                      {language === "en" ? "العربية" : "English"}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleToggleTheme}
                    className="theme-toggle-enhanced relative overflow-hidden transition-all duration-300 hover:bg-accent/80"
                  >
                    <div className="icon-rotate">
                      {isDark ? (
                        <Sun className="h-4 w-4 transition-all duration-300" />
                      ) : (
                        <Moon className="h-4 w-4 transition-all duration-300" />
                      )}
                    </div>
                    <span>
                      {isDark
                        ? t("nav.light") || "Light"
                        : t("nav.dark") || "Dark"}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleCurrencyChange}
                    className="currency-toggle-enhanced relative overflow-hidden transition-all duration-300 hover:bg-accent/80"
                  >
                    <DollarSign className="h-4 w-4 transition-all duration-300" />
                    <span>{t("nav.currency") || "Currency"}</span>
                    <span className="ml-auto text-xs opacity-60 font-medium">
                      {getCurrencyDisplay()}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("nav.logout") || "Logout"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="text-xs text-muted-foreground text-center py-2">
            Aqar Zone © {new Date().getFullYear()}
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
