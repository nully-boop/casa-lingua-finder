
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Mock data for user profile
const mockUserProfile = {
  name: "Ahmed Al-Rashid",
  email: "ahmed@example.com",
  phone: "+971 50 123 4567",
  location: "Dubai, UAE",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  joinDate: "January 2023",
  bio: "Real estate enthusiast looking for the perfect home in Dubai.",
};

// Mock data for seller profile
const mockSellerProfile = {
  ...mockUserProfile,
  companyName: "Prime Properties UAE",
  license: "RERA-12345",
  rating: 4.8,
  totalSales: 156,
  activeListings: 12,
  totalReviews: 89,
  yearsExperience: 8,
  bio: "Experienced real estate agent specializing in luxury properties in Dubai Marina and Downtown areas.",
};

const Profile = () => {
  const { t, language, user, isAuthenticated } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(
    user?.user_type === "seller" ? mockSellerProfile : mockUserProfile
  );

  if (!isAuthenticated) {
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

  const isSeller = user?.user_type === "seller";

  const handleSave = () => {
    // Mock save functionality
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback>
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                      {isSeller && (
                        <p className="text-lg text-muted-foreground mb-2">
                          {profileData.companyName}
                        </p>
                      )}
                      <div className="flex items-center justify-center md:justify-start space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <MapPin className="h-4 w-4" />
                          <span>{profileData.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <User className="h-4 w-4" />
                          <span>{language === "ar" ? "انضم في" : "Joined"} {profileData.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>{isEditing ? t("common.cancel") : t("common.edit")}</span>
                    </Button>
                  </div>

                  {isSeller && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{profileData.rating}</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {language === "ar" ? "التقييم" : "Rating"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{profileData.totalSales}</div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "إجمالي المبيعات" : "Total Sales"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{profileData.activeListings}</div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "العقارات النشطة" : "Active Listings"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{profileData.yearsExperience}</div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "سنوات الخبرة" : "Years Experience"}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground">{profileData.bio}</p>
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
                    <span>{language === "ar" ? "المعلومات الشخصية" : "Personal Information"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{language === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{language === "ar" ? "رقم الهاتف" : "Phone Number"}</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{language === "ar" ? "الموقع" : "Location"}</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    {isSeller && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="company">{language === "ar" ? "اسم الشركة" : "Company Name"}</Label>
                          <Input
                            id="company"
                            value={profileData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="license">{language === "ar" ? "رقم الترخيص" : "License Number"}</Label>
                          <Input
                            id="license"
                            value={profileData.license}
                            onChange={(e) => handleInputChange("license", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                      <Button onClick={() => setIsEditing(false)} variant="outline">
                        {t("common.cancel")}
                      </Button>
                      <Button onClick={handleSave} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Save className="h-4 w-4" />
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
                    {language === "ar" ? "تفضيلات الحساب" : "Account Preferences"}
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
