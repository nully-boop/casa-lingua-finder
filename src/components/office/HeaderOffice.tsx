import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import IOffice from "@/interfaces/IOffice";
import GlobalAIChatButton from "../buttons/GlobalAIChatButton";

interface IHeaderOfficeProps {
  profileData?: IOffice;
  isError?: boolean;
  error?: unknown;
}

const HeaderOffice: React.FC<IHeaderOfficeProps> = ({
  profileData,
  isError: isProfileQueryError,
  error: profileQueryError,
}) => {
  const { t, user } = useLanguage();

  useEffect(() => {
    if (isProfileQueryError && profileQueryError) {
      console.error(
        "Header profile query error:",
        (profileQueryError as Error).message
      );
    }
  }, [isProfileQueryError, profileQueryError]);

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
                to="/dashboard"
                className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
              >
                <span>{t("nav.dashboard") || "Dashboard"}</span>
              </Link>
              <Link
                to="/properties-office"
                className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary transition-colors"
              >
                <span>{t("nav.properties") || "Properties"}</span>
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-5">
                {isProfileQueryError && (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                {/* AI Chat Button */}
                <GlobalAIChatButton />

                <SidebarTrigger asChild>
                  <button
                    type="button"
                    className="p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                  >
                    <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage
                        src={profileData?.image?.url || user.image?.url}
                        alt={profileData?.name || user.name}
                      />
                      <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
                    </Avatar>
                  </button>
                </SidebarTrigger>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderOffice;
