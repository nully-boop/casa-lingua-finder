import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Moon,
  Sun,
  Monitor,
  Trash,
  Save,
  Edit,
  Image,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profileAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const placeholderImg =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=facearea&w=128&q=80";

const Settings = () => {
  const { isAuthenticated } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  // -- Fetch profile data from backend --
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["settings-profile"],
    queryFn: async () => {
      const response = await profileAPI.getProfile();
      return response.data; // Assuming { id, name, phone, user_type, photo/avatar... }
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

  // Sync formData & photo once profileData is loaded
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

  // --- Use *only* the correct image URL for profile image ---
  const profileImage =
    photoPreview ||
    (profileData && profileData.image && profileData.image.url)
      ? profileData.image.url
      : placeholderImg;

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
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      let payload: any;
      const isAvatarChanged = !!avatarFile;

      if (isAvatarChanged) {
        payload = new FormData();
        payload.append("name", formData.name);
        payload.append("phone", formData.phone);
        // --- use "url" key for photo file ---
        payload.append("url", avatarFile);
      } else {
        payload = {
          name: formData.name,
          phone: formData.phone,
        };
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
      refetch(); // fetch the new api data again
    } catch (error: any) {
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
  const handleStartPhotoEdit = () => {
    setIsPhotoEditing(true);
  };

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
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar edit section */}
                  <div className="flex items-center gap-5">
                    <Avatar className="h-20 w-20 border-2 border-muted">
                      <AvatarImage src={profileImage} alt={formData.name} />
                      <AvatarFallback>
                        <User className="w-8 h-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        {isPhotoEditing ? (
                          <>
                            <Input
                              ref={fileInputRef}
                              id="avatar"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarChange}
                              disabled={!isEditing}
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex items-center gap-2"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={!isEditing}
                            >
                              <Image className="h-4 w-4" />
                              {photoPreview ? "Change Photo" : "Choose Photo"}
                            </Button>
                            {photoPreview && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Preview is shown above.
                              </div>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelPhotoEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={handleStartPhotoEdit}
                              disabled={!isEditing}
                            >
                              <Edit className="h-4 w-4" />
                              Edit Photo
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Recommended: Square image, max 2MB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>User Type</Label>
                    <Input value={profileData.user_type || ""} disabled />
                  </div>

                  <div className="flex gap-2 pt-4">
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setIsPhotoEditing(false);
                            setPhotoPreview(null);
                            setAvatarFile(null);
                            // Reset fields to latest profile
                            setFormData({
                              name: profileData.name || "",
                              phone: profileData.phone || "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getThemeIcon()}
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the application looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme or use system setting
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Current Theme Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Currently using {isDark ? "dark" : "light"} mode
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isDark ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-destructive">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2"
                    >
                      <Trash className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
