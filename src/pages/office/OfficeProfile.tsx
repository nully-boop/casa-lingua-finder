import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Phone,
  Users,
  Eye,
  Calendar,
  UserPlus,
  UserCheck,
  Bed,
  Bath,
  Square,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { office } from "@/services/api";
import AccessDenied from "@/components/AccessDenied";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import IProperty from "@/interfaces/IProperty";
import IOffice from "@/interfaces/IOffice";

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
  } = useQuery({
    queryKey: ["office-profile", id],
    queryFn: async () => {
      if (!id) throw new Error("Office ID is required");
      const response = await office.getOfficeById(id);
      return response.data.data as IOffice;
    },
    enabled: !!id,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  // Get office properties
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = useQuery({
    queryKey: ["office-properties", id],
    queryFn: async () => {
      if (!id) throw new Error("Office ID is required");
      const response = await office.getAllOfficeProperties(id);
      return response.data.data as IProperty[];
    },
    enabled: !!id,
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
        description:
          t("office.followSuccessDesc") || "You are now following this office",
      });
      // Refresh office data to update followers count
      queryClient.invalidateQueries({ queryKey: ["office-profile", id] });
    },
    onError: (error) => {
      alert(error);
      toast({
        title: t("common.error") || "Error",
        description: t("office.followError") || "Failed to follow office",
        variant: "destructive",
      });
    },
  });

  const handleFollow = () => {
    if (!isAuthenticated || !hasToken()) {
      toast({
        title: t("auth.loginRequired") || "Login Required",
        description:
          t("auth.loginToFollow") || "Please login to follow offices",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (user?.type !== "user") {
      toast({
        title: t("office.userOnly") || "User Only",
        description:
          t("office.userOnlyDesc") || "Only users can follow offices",
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
              {t("office.notFoundDesc") ||
                "The office you're looking for doesn't exist or has been removed."}
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
                      <h1 className="text-3xl font-bold mb-2">
                        {officeData.name}
                      </h1>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Badge
                          variant={
                            officeData.status === "approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {officeData.status === "approved"
                            ? t("office.verified") || "Verified"
                            : t("office.pending") || "Pending"}
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
                          ? t("office.following") || "Following"
                          : t("office.follow") || "Follow"}
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
                      <span>
                        {officeData.followers_count}{" "}
                        {t("office.followers") || "followers"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {officeData.views} {t("office.views") || "views"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t("office.memberSince") || "Member since"}{" "}
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {t("office.properties") || "Properties"}
                </h2>
                <Badge variant="outline">
                  {propertiesData?.length || 0}{" "}
                  {t("office.properties") || "properties"}
                </Badge>
              </div>

              {propertiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t("common.loading") || "Loading properties..."}
                    </p>
                  </div>
                </div>
              ) : propertiesError ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t("office.propertiesError") || "Error loading properties"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("office.propertiesErrorDesc") ||
                      "Failed to load properties from this office"}
                  </p>
                </div>
              ) : !propertiesData || propertiesData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t("office.noProperties") || "No properties yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("office.noPropertiesDesc") ||
                      "This office hasn't listed any properties yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propertiesData.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: IProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <CardContent className="p-4">
        {/* Property Image Placeholder */}
        <div className="w-full h-50 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <img
            src={
              property.images && property.images.length > 0
                ? property.images[0].url
                : "https://placehold.co/400x300?text=No+Image"
            }
            alt={property.title}
            className="object-cover"
          />{" "}
        </div>

        {/* Property Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-green-600">
                {formatPrice(property.price)}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {property.ad_type === "sale"
                ? t("property.sale") || "For Sale"
                : t("property.rent") || "For Rent"}
            </Badge>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Bed className="h-3 w-3" />
                <span>{property.rooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-3 w-3" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-3 w-3" />
                <span>{property.area}m²</span>
              </div>
            </div>
          </div>

          {/* Property Type & Status */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {property.type}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>
                {property.views} {t("property.views") || "views"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficeProfile;
