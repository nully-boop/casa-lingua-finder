
import React from "react";
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Moon, User, LogOut, Translate, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem as DropMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const { language, setLanguage, t, user, logout, isAuthenticated } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleToggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const handleLogout = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const userObj = JSON.parse(userData);
      const token = userObj.token;
      await authAPI.logout(token);

      toast({
        title: t("toast.logoutSuccess") || "Logout successful",
        description: t("toast.seeYouAgain") || "See you again!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: t("toast.logoutFailed") || "Logout failed",
        description: t("toast.error") || "Error happened",
        variant: "destructive",
      });
    } finally {
      localStorage.removeItem("user");
    }
  };

  // Fallback avatar image/initials
  const getAvatar = () => {
    const initials = user?.name
      ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
      : "U";
    const img = user?.profile_photo || undefined;
    return { img, initials };
  };

  // Desktop/Tablet: Sidebar with actions, Mobile: Avatar with dropdown menu for actions
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center">
          {isAuthenticated ? (
            isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      {getAvatar().img ? (
                        <AvatarImage src={getAvatar().img} alt={user.name} />
                      ) : (
                        <AvatarFallback>
                          {getAvatar().initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[99]">
                  <div className="flex items-center p-2">
                    <Avatar className="mr-2">
                      {getAvatar().img ? (
                        <AvatarImage src={getAvatar().img} alt={user.name} />
                      ) : (
                        <AvatarFallback>
                          {getAvatar().initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t("nav.profile")}
                    </Link>
                  </DropMenuItem>
                  <DropMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      {t("nav.settings")}
                    </Link>
                  </DropMenuItem>
                  <DropMenuItem onClick={handleToggleTheme} className="flex items-center gap-2">
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {isDark ? t("nav.light") || "Light" : t("nav.dark") || "Dark"}
                  </DropMenuItem>
                  <DropMenuItem onClick={handleToggleLanguage} className="flex items-center gap-2">
                    <Translate className="h-4 w-4" />
                    {t("nav.language")}
                  </DropMenuItem>
                  <DropdownMenuSeparator />
                  <DropMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </DropMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="mb-2">
                  {getAvatar().img ? (
                    <AvatarImage src={getAvatar().img} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {getAvatar().initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-xs font-semibold">{user.name}</div>
                <div className="text-[10px] text-muted-foreground">{user.email}</div>
              </div>
            )
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.menu") || "Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">{t("nav.home")}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/properties">{t("nav.properties")}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAuthenticated && user.user_type === "seller" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/dashboard">{t("nav.dashboard")}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAuthenticated && !isMobile && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("nav.profileActions") || "Actions"}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4 mr-2" />
                      {t("nav.profile")}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      {t("nav.settings")}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleToggleTheme}>
                    {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {isDark ? t("nav.light") || "Light" : t("nav.dark") || "Dark"}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleToggleLanguage}>
                    <Translate className="h-4 w-4 mr-2" />
                    {t("nav.language")}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.logout")}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        {/* Optional: add copyright or branding */}
        <div className="text-xs text-muted-foreground text-center py-2">Casa Lingua © {new Date().getFullYear()}</div>
      </SidebarFooter>
    </Sidebar>
  );
}
