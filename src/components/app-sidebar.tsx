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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import IUser from "@/interfaces/IUser";

interface AppSideBarProps {
  user: IUser;
}
export const AppSidebar: React.FC<AppSideBarProps> = () => {
  const { language, setLanguage, t, user, logout } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleToggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

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

  const getAvatarInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  const sidebarSide = language === "ar" ? "left" : "right";
  const profileImage = user.image?.url;
  return (
    <Sidebar side={sidebarSide}>
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
            <AvatarImage src={profileImage} alt={user?.name} />
            <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
          </Avatar>

          <div className="text-sm font-semibold text-center">
            {user?.name || "User"}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {user?.phone}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
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
                  <Link to="/settings">
                    <Settings className="w-4 h-4" />
                    <span>{t("nav.settings") || "Settings"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleToggleLanguage}>
                  <Globe className="h-4 w-4" />
                  <span>{t("nav.language") || "Language"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleToggleTheme}>
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>
                    {isDark
                      ? t("nav.light") || "Light"
                      : t("nav.dark") || "Dark"}
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
          Casa Lingua © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
