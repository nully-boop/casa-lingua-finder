import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Phone, Users, Eye, Calendar, UserPlus, UserCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { office } from "@/services/api";
import AccessDenied from "@/components/AccessDenied";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface OfficeData {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  phone: string;
  type: string;
  status: string;
  free_ads: number;
  followers_count: number;
  views: number;
  created_at: string;
  updated_at: string;
  image?: {
    url: string;
  };
}

const OfficeProfile = () => {
  const { t, isAuthenticated, hasToken, user } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);

  // Get office data
  const {
    data: officeData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["office-profile", id],
    queryFn: async () => {
      if (!id) throw new Error("Office ID is required");
      const response = await office.getOfficeById(id);
      return response.data.data as OfficeData;
    },
    enabled: !!id,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Office ID is required");
      const response = await office.followOffice(id);
      return response;
    },
    onSuccess: () => {
      setIsFollowing(true);
      toast({
        title: t("office.followSuccess") || "Success",
        description: t("office.followSuccessDesc") || "You are now following this office",
      });
      // Refresh office data to update followers count
      queryClient.invalidateQueries({ queryKey: ["office-profile", id] });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error") || "Error",
        description: error.response?.data?.message || t("office.followError") || "Failed to follow office",
        variant: "destructive",
      });
    },
  });

  const handleFollow = () => {
    if (!isAuthenticated || !hasToken()) {
      toast({
        title: t("auth.loginRequired") || "Login Required",
        description: t("auth.loginToFollow") || "Please login to follow offices",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (user?.type !== "user") {
      toast({
        title: t("office.userOnly") || "User Only",
        description: t("office.userOnlyDesc") || "Only users can follow offices",
        variant: "destructive",
      });
      return;
    }

    followMutation.mutate();
  };

  if (!isAuthenticated || !hasToken()) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t("common.loading") || "Loading office profile..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !officeData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              {t("office.notFound") || "Office Not Found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("office.notFoundDesc") || "The office you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/")}>
              {t("common.goHome") || "Go Home"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Office Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Office Image */}
                <div className="flex-shrink-0">
                  {officeData.image?.url ? (
                    <img
                      src={officeData.image.url}
                      alt={officeData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                      <Users className="h-16 w-16 text-primary/60" />
                    </div>
                  )}
                </div>

                {/* Office Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{officeData.name}</h1>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Badge variant={officeData.status === "approved" ? "default" : "secondary"}>
                          {officeData.status === "approved" 
                            ? (t("office.verified") || "Verified") 
                            : (t("office.pending") || "Pending")}
                        </Badge>
                      </div>
                    </div>

                    {/* Follow Button */}
                    {user?.type === "user" && (
                      <Button
                        onClick={handleFollow}
                        disabled={followMutation.isPending || isFollowing}
                        className="mt-4 md:mt-0"
                      >
                        {followMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : isFollowing ? (
                          <UserCheck className="h-4 w-4 mr-2" />
                        ) : (
                          <UserPlus className="h-4 w-4 mr-2" />
                        )}
                        {isFollowing 
                          ? (t("office.following") || "Following")
                          : (t("office.follow") || "Follow")}
                      </Button>
                    )}
                  </div>

                  {/* Office Description */}
                  {officeData.description && (
                    <p className="text-muted-foreground mb-4">
                      {officeData.description}
                    </p>
                  )}

                  {/* Office Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {officeData.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{officeData.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{officeData.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{officeData.followers_count} {t("office.followers") || "followers"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{officeData.views} {t("office.views") || "views"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t("office.memberSince") || "Member since"} {" "}
                        {new Date(officeData.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Properties Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("office.properties") || "Properties"}
              </h2>
              <p className="text-muted-foreground">
                {t("office.propertiesDesc") || "Properties from this office will be displayed here."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficeProfile;
