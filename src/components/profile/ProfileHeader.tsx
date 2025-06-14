
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ProfileHeaderProps {
  user: any;
  language: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, language }) => {
  const date = format(new Date(user.created_at), "dd-MM-yyyy", {
    locale: language === "ar" ? ar : undefined,
  });
  const profileImage = user.image?.url;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profileImage} alt={user?.name} />
        <AvatarFallback>
          {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {user.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <User className="h-4 w-4" />
                <span>
                  {language === "ar" ? "انضم في" : "Joined at"} {date || "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">
          {user.bio || "No bio available."}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
