import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Image, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import { profileAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";

const ProfileInfo = () => {
  const { isAuthenticated } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["settings-profile"],
    queryFn: async () => {
      const response = await profileAPI.getProfile();
      return response.data;
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

  const getAvatarInitials = () => {
    if (profileData?.name) {
      return profileData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  const profileImage =
    photoPreview ||
    (profileData?.image?.url ? profileData.image.url : getAvatarInitials);

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
          <button className="btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      let payload: FormData | { name: string; phone: string };
      const isAvatarChanged = !!avatarFile;

      if (isAvatarChanged && avatarFile) { // Ensure avatarFile is not null
        payload = new FormData(); // Initialize payload here
        payload.append("name", formData.name);
        payload.append("phone", formData.phone);
        payload.append("url", avatarFile); // avatarFile is confirmed to be non-null here

        console.log("Sending profile update with image file:", {
          name: formData.name,
          phone: formData.phone,
          hasFile: !!avatarFile,
          fileName: avatarFile?.name,
        });
      } else {
        payload = {
          name: formData.name,
          phone: formData.phone,
        };

        console.log("Sending profile update without image:", payload);
      }

      const response = await profileAPI.updateProfile(payload);

      const currentUser = authService.getCurrentUser();
      if (currentUser && response.data) {
        const updatedUser = {
          ...currentUser,
          name: response.data.name || formData.name,
          phone: response.data.phone || formData.phone,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("Updated localStorage with new profile data:", updatedUser);
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      setIsPhotoEditing(false);
      setPhotoPreview(null);
      setAvatarFile(null);
      refetch();
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      let errorMessage = "Could not update profile.";
      if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response as { data?: { message?: string } };
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Profile Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

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
  
  const onEditProfile = () => setIsEditing(true);

  const onCancelEdit = () => {
    setIsEditing(false);
    setIsPhotoEditing(false);
    setPhotoPreview(null);
    setAvatarFile(null);
    setFormData({
      name: profileData.name || "",
      phone: profileData.phone || "",
    });
  };

  return (
    <div className="space-y-4">
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
          <Button onClick={onEditProfile} className="flex items-center gap-2">
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
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
