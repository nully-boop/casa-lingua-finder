import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "@/services/api";
import ProfileHeader from "@/components/profile/ProfileHeader";

// Interface for user profile data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  url?: string;
  joinDate: string;
  bio?: string;
  user_type: string;
  image?: { url: string };
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
  const { t, language, isAuthenticated } = useLanguage();
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
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      const response = await profileAPI.getProfile();
      return { user: response.data, seller: response.seller };
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

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

  // Remove all editing, only display info now
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <ProfileHeader user={profileData.user} language={language} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
