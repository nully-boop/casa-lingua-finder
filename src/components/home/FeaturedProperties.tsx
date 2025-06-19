import { useLanguage } from "@/contexts/LanguageContext";
import IProperty from "@/interfaces/IProperty";
import { useNavigate, useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import PropertyCard from "../properties/PropertyCard";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import { Button } from "../ui/button";
import { normalizeProperty } from "@/func/properties";


interface IProps {
  apiProperties: IProperty[];
  isLoading: boolean;
  error: boolean;
}

const FeaturedProperties: FC<IProps> = ({
  apiProperties,
  isLoading,
  error,
}) => {
  const { t, language, isAuthenticated } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const properties = apiProperties
    ? apiProperties.slice(0, 4).map(normalizeProperty)
    : [];

  const onViewAll = () => {
    navigate("/properties");
  };
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
    enabled: !!id && isAuthenticated && !error, // Don't run if main query failed
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

  const propertyArray = !error ? apiProperties || [] : [];
  const isFavorited =
    !isFavoriteQueryError && favoritedResponse?.data?.is_favorited === true;

  const rawProperty = propertyArray.find(
    (prop: IProperty) => prop.id === parseInt(id!)
  );
  const property =
    rawProperty && !error ? normalizeProperty(rawProperty) : null;

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
  if (isLoading || (isFavoritedLoading && isAuthenticated)) {
    return (
      <div className="text-center py-20 text-lg">
        {t("common.loading") || "Loading..."}
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "ar" ? "العقارات المميزة" : "Featured Properties"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar"
              ? "اكتشف أفضل العقارات المتاحة"
              : "Discover the best properties available"}
          </p>
        </div>

        {error && (
          <div className="text-center py-20 text-destructive">
            {t("common.error") || "Error loading properties"}
          </div>
        )}

        {!isLoading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                property={property}
                isFavorited={isFavorited}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">
              {language === "ar"
                ? "لا توجد عقارات متاحة"
                : "No properties available"}
            </h3>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 mt-8 flex justify-center">
        <Button
          className="border border-primary bg-white text-primary rounded px-6 py-3 text-lg font-semibold hover:bg-primary hover:text-white transition-colors"
          onClick={onViewAll}
        >
          {language === "ar" ? "عرض جميع العقارات" : "View All Properties"}
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProperties;
