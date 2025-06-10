import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit3,
  Save,
  Star,
  MessageSquare,
  Eye,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "@/services/api";

// Interface for user profile data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  joinDate: string;
  bio?: string;
  user_type: string;
}

// Interface for seller profile data extending user profile
interface SellerProfile extends UserProfile {
  companyName?: string;
  license?: string;
  rating?: number;
  totalSales?: number;
  activeListings?: number;
  totalReviews?: number;
  yearsExperience?: number;
}

const Profile = () => {
  const { t, language, user, isAuthenticated } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Check if user has token
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

  // Fetch profile data from API
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data...");
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      const response = await profileAPI.getProfile();
      console.log("Profile data received:", response.data, response.seller);
      return { user: response.data, seller: response.seller };
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile | SellerProfile>) => {
      console.log("Updating profile with data:", data);
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      return profileAPI.updateProfile(data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      if (error?.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please login again to update your profile.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const [editData, setEditData] = useState<
    Partial<UserProfile | SellerProfile>
  >({});

  if (!isAuthenticated || !hasToken()) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to access this page.
          </p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">
            Failed to load profile data: {errorMessage}
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["profile"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const isSeller = profileData?.user.user_type === "seller";

  // Type guard to check if profileData is SellerProfile
  const isSellerProfile = (
    profile: UserProfile | SellerProfile
  ): profile is SellerProfile => {
    return isSeller && profile.user_type === "seller";
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const startEditing = () => {
    setEditData(profileData.user);
    setIsEditing(true);
  };

  const currentData = isEditing ? { ...profileData, ...editData } : profileData;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={currentData?.user.avatar}
                    alt={currentData?.user.name}
                  />
                  <AvatarFallback>
                    {currentData?.user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {currentData?.user.name}
                      </h1>
                      {isSellerProfile(currentData.user) &&
                        currentData.seller.company_name && (
                          <p className="text-lg text-muted-foreground mb-2">
                            {currentData.seller.company_name}
                          </p>
                        )}
                      <div className="flex items-center justify-center md:justify-start space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                        {currentData?.user.location && (
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <MapPin className="h-4 w-4" />
                            <span>{currentData.user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <User className="h-4 w-4" />
                          <span>
                            {language === "ar" ? "انضم في" : "Joined"}{" "}
                            {currentData?.user.created_at || "Recently"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        isEditing ? setIsEditing(false) : startEditing()
                      }
                      variant="outline"
                      className="flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>
                        {isEditing ? t("common.cancel") : t("common.edit")}
                      </span>
                    </Button>
                  </div>

                  {isSellerProfile(currentData.user) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {currentData.seller.rating || 0}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {language === "ar" ? "التقييم" : "Rating"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {currentData.seller.totalSales || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar"
                            ? "إجمالي المبيعات"
                            : "Total Sales"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {currentData.seller.activeListings || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar"
                            ? "العقارات النشطة"
                            : "Active Listings"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {currentData.seller.yearsExperience || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar"
                            ? "سنوات الخبرة"
                            : "Years Experience"}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground">
                    {currentData?.user.bio || "No bio available."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">
                {language === "ar" ? "المعلومات الشخصية" : "Personal Info"}
              </TabsTrigger>
              <TabsTrigger value="preferences">
                {language === "ar" ? "التفضيلات" : "Preferences"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <User className="h-5 w-5" />
                    <span>
                      {language === "ar"
                        ? "المعلومات الشخصية"
                        : "Personal Information"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === "ar" ? "الاسم الكامل" : "Full Name"}
                      </Label>
                      <Input
                        id="name"
                        value={currentData?.user.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === "ar" ? "البريد الإلكتروني" : "Email"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={currentData?.user.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                      </Label>
                      <Input
                        id="phone"
                        value={currentData?.user.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">
                        {language === "ar" ? "الموقع" : "Location"}
                      </Label>
                      <Input
                        id="location"
                        value={currentData?.user.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    {isSellerProfile(currentData.user) && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="company">
                            {language === "ar" ? "اسم الشركة" : "Company Name"}
                          </Label>
                          <Input
                            id="company"
                            value={currentData.seller.company_name || ""}
                            onChange={(e) =>
                              handleInputChange("companyName", e.target.value)
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="license">
                            {language === "ar"
                              ? "رقم الترخيص"
                              : "License Number"}
                          </Label>
                          <Input
                            id="license"
                            value={currentData.seller.license_number || ""}
                            onChange={(e) =>
                              handleInputChange("license", e.target.value)
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex items-center space-x-2 rtl:space-x-reverse"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>{t("common.save")}</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "ar"
                      ? "تفضيلات الحساب"
                      : "Account Preferences"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "إعدادات التفضيلات قيد التطوير..."
                      : "Preference settings coming soon..."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
