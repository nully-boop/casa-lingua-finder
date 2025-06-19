import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertTriangle, RotateCw } from "lucide-react";
import Footer from "@/components/Footer";
import PropertyImageGallery from "@/components/properties/PropertyImageGallery";
import PropertyInfoCard from "@/components/properties/PropertyInfoCard";
import AgentSidebar from "@/components/properties/AgentSidebar";
import RelatedProperties from "@/components/properties/RelatedProperties";
import { AIChatDrawer } from "@/components/properties/AIChatDrawer";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/auth/AuthModal";

const normalizeProperty = (property: IProperty): IProperty => {
  return {
    ...property,
    price:
      typeof property.price === "string"
        ? parseFloat(property.price) || 0
        : property.price,
    area:
      typeof property.area === "string"
        ? parseFloat(property.area) || 0
        : property.area,
  };
};

const formatPrice = (price: number, currency: string) => {
  if (currency === "USD") return `$${price.toLocaleString()}`;
  if (currency === "AED") return `${price.toLocaleString()} د.إ`;
  return `${price.toLocaleString()} ${currency}`;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, isRTL, isAuthenticated } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const {
    data: propertyResponse,
    isLoading: isPropertyLoading,
    isError: isPropertyQueryError,
    error: propertyQueryError,
    refetch: refetchProperty,
  } = useQuery({
    queryKey: ["property-details", id],
    queryFn: () => propertiesAPI.getProperty(id!),
    enabled: !!id,
  });

  // Check if property is favorited - only if user is authenticated
  const {
    data: favoritedResponse,
    isLoading: isFavoritedLoading,
    isError: isFavoriteQueryError,
    error: favoriteQueryError,
    // We might not need a dedicated refetch for this if main property load fails,
    // or if favorite action itself handles refetch on error.
  } = useQuery({
    queryKey: ["property-favorited", id],
    queryFn: () => propertiesAPI.isFavorited(parseInt(id!)),
    enabled: !!id && isAuthenticated && !isPropertyQueryError, // Don't run if main query failed
  });

  useEffect(() => {
    if (isFavoriteQueryError) {
      console.error(
        "Favorite status query error:",
        favoriteQueryError?.message
      );
      // Optionally, show a non-intrusive toast or log to an error reporting service
      // toast({
      //   title: t("error.favoriteStatusErrorTitle") || "Favorite Status Error",
      //   description: favoriteQueryError?.message || t("error.favoriteStatusErrorDescription") || "Could not load favorite status.",
      //   variant: "destructive",
      //   duration: 3000, // Short duration
      // });
    }
  }, [isFavoriteQueryError, favoriteQueryError, t, toast]);

  const propertyArray = !isPropertyQueryError
    ? propertyResponse?.data?.property || []
    : [];
  const relatedPropertiesRaw = !isPropertyQueryError
    ? propertyResponse?.data?.relaitedproperties || []
    : [];

  const isFavorited =
    !isFavoriteQueryError && favoritedResponse?.data?.is_favorited === true;

  const rawProperty = propertyArray.find(
    (prop: IProperty) => prop.id === parseInt(id!)
  );
  const property =
    rawProperty && !isPropertyQueryError
      ? normalizeProperty(rawProperty)
      : null;

  const relatedProperties = relatedPropertiesRaw
    .map((prop: IProperty) => normalizeProperty(prop))
    .filter((prop: IProperty) => prop.id !== parseInt(id!));

  const favoriteMutation = useMutation({
    mutationFn: (propertyId: number) => {
      if (isFavorited) {
        return propertiesAPI.removeFromFavorite(propertyId);
      } else {
        return propertiesAPI.addToFavorite(propertyId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-favorited", id] });
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: isFavorited
          ? language === "ar"
            ? "تم إزالة العقار من المفضلة"
            : "Property removed from favorites"
          : language === "ar"
          ? "تم إضافة العقار إلى المفضلة"
          : "Property added to favorites",
      });
    },
    onError: (error) => {
      console.error("Error updating favorite:", error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description:
          language === "ar"
            ? "حدث خطأ في تحديث المفضلة"
            : "Error updating favorites",
        variant: "destructive",
      });
    },
  });

  const handleFavorite = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (property) {
      favoriteMutation.mutate(property.id);
    }
  };

  if (
    isPropertyLoading ||
    (isAuthenticated && isFavoritedLoading && !isPropertyQueryError)
  ) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">
            {t("common.loadingProperty") || "Loading property details..."}
          </p>
        </div>
      </div>
    );
  }

  if (isPropertyQueryError || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">
            {t("error.loadFailed", { ns: "common" }) ||
              "Failed to Load Property Details"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {(propertyQueryError as Error)?.message
              ? t("error.specificLoadFailed", {
                  ns: "common",
                  message: (propertyQueryError as Error).message,
                })
              : t("propertyDetails.error.generic", { ns: "property" }) ||
                "Could not load the property details. Please try again."}
          </p>
          <Button onClick={() => refetchProperty()} variant="outline">
            <RotateCw className="h-4 w-4 mr-2" />
            {t("common.retry") || "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  const images = property?.images || [];
  const propertyImages =
    images.length > 0
      ? images.map((img) => img.url)
      : ["https://placehold.co/400x300?text=No+Image"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft
            className={`h-4 w-4 ${
              isRTL ? "rotate-180" : ""
            } mr-2 rtl:mr-0 rtl:ml-2`}
          />
          {language === "ar" ? "العودة" : "Back"}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyImageGallery
              images={propertyImages}
              title={property?.title}
              adType={property?.ad_type}
              isFavorited={isFavorited}
              favoriteQueryFailed={isFavoriteQueryError}
              onFavorite={handleFavorite}
              onChat={() => setIsChatOpen(true)}
            />

            <PropertyInfoCard
              property={{ ...property }}
              latitude={property?.latitude}
              longitude={property?.longitude}
            />
          </div>

          {/* Agent Info Sidebar */}
          <div className="space-y-6">
            <AgentSidebar />
          </div>
        </div>

        {/* Related Properties Section */}
        <RelatedProperties
          relatedProperties={relatedProperties}
          language={language}
          formatPrice={formatPrice}
        />
      </div>

      {property && (
        <AIChatDrawer
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          property={property}
        />
      )}

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      <Footer />
    </div>
  );
};

export default PropertyDetails;
