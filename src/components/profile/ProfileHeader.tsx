import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Building, Eye, Users, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import IUser from "@/interfaces/IUser";
import IOffice from "@/interfaces/IOffice";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  user: IUser | IOffice;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const date = format(new Date(user.created_at), "dd-MM-yyyy", {
    locale: language === "ar" ? ar : undefined,
  });
  const profileImage = user.image?.url;
  const isOffice = user.type === "office";
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profileImage} alt={user?.name} />
        <AvatarFallback>
          {user?.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("") || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {isOffice ? (
                  <Building className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>
                  {language === "ar" ? "انضم في" : "Joined at"}{" "}
                  {date || "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">
          {isOffice
            ? (user as IOffice).description || "No description available."
            : "No bio available."}
        </p>

        {isOffice && (
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <CheckCircle className="h-3 w-3" />
                <span className="capitalize">{(user as IOffice).status}</span>
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>
                {(user as IOffice).views}{" "}
                {language === "ar" ? "مشاهدة" : "views"}
              </span>
            </div>

            <div
              className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer"
              onClick={() => navigate("/followers")}
            >
              <Users className="h-4 w-4" />
              <span>
                {(user as IOffice).followers_count}{" "}
                {t("office.followersCount") ||
                  (language === "ar" ? "متابع" : "followers")}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>
                {(user as IOffice).free_ads}{" "}
                {language === "ar" ? "إعلان مجاني" : "free ads"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
