
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import ProfileInfo from "@/components/settings/ProfileInfo";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import DangerZone from "@/components/settings/DangerZone";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Sun, Moon, Monitor } from "lucide-react";

const placeholderImg =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=facearea&w=128&q=80";

const Settings = () => {
  const { isAuthenticated } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch profile data from backend
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["settings-profile"],
    queryFn: async () => {
      const response = await profileAPI.getProfile();
      return response.data; // user data comes here
    },
    enabled: isAuthenticated,
  });

  // Form state
  const [formData, setFormData] = useState({ name: "", phone: "" });
  // Avatar edit state
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
      });
      setPhotoPreview(null);
      setAvatarFile(null);
    }
  }, [profileData]);

  const profileImage =
    photoPreview || (profileData?.image?.url ? profileData.image.url : placeholderImg);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header />
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <span className="text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header />
        <div className="max-w-sm bg-card p-6 mt-32 rounded shadow">
          <div className="text-lg font-bold mb-2 text-destructive">Error</div>
          <div className="text-muted-foreground mb-4">
            Could not load profile. Please try again.
          </div>
          <button className="btn" onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      let payload: any;
      const isAvatarChanged = !!avatarFile;

      if (isAvatarChanged) {
        // Create FormData and append the file with the correct field name "url"
        payload = new FormData();
        payload.append("name", formData.name);
        payload.append("phone", formData.phone);
        payload.append("url", avatarFile); // The file should be sent with field name "url"
        
        console.log("Sending profile update with image file:", {
          name: formData.name,
          phone: formData.phone,
          hasFile: !!avatarFile,
          fileName: avatarFile?.name
        });
      } else {
        payload = {
          name: formData.name,
          phone: formData.phone,
        };
        
        console.log("Sending profile update without image:", payload);
      }

      await profileAPI.updateProfile(payload);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      setIsPhotoEditing(false);
      setPhotoPreview(null);
      setAvatarFile(null);
      refetch();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Profile Update Failed",
        description:
          error?.response?.data?.message || "Could not update profile.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
    authService.logout();
    navigate("/");
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system");
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme}`,
    });
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  // --- Avatar logic ---
  const handleStartPhotoEdit = () => setIsPhotoEditing(true);
  const handleCancelPhotoEdit = () => {
    setIsPhotoEditing(false);
    setPhotoPreview(null);
    setAvatarFile(null);
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileInfo
                formData={formData}
                profileImage={profileImage}
                isEditing={isEditing}
                isPhotoEditing={isPhotoEditing}
                photoPreview={photoPreview}
                avatarFile={avatarFile}
                fileInputRef={fileInputRef}
                profileData={profileData}
                onStartPhotoEdit={handleStartPhotoEdit}
                onCancelPhotoEdit={handleCancelPhotoEdit}
                onAvatarChange={handleAvatarChange}
                onSaveProfile={handleSaveProfile}
                onEditProfile={() => setIsEditing(true)}
                onCancelEdit={() => {
                  setIsEditing(false);
                  setIsPhotoEditing(false);
                  setPhotoPreview(null);
                  setAvatarFile(null);
                  setFormData({
                    name: profileData.name || "",
                    phone: profileData.phone || "",
                  });
                }}
                setFormData={setFormData}
              />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings
                theme={theme}
                isDark={isDark}
                handleThemeChange={handleThemeChange}
                getThemeIcon={getThemeIcon}
              />
            </TabsContent>
            <TabsContent value="account">
              <DangerZone handleDeleteAccount={handleDeleteAccount} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
