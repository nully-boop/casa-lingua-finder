import { useLanguage } from "@/contexts/LanguageContext";
import IProperty from "@/interfaces/IProperty";
import { useNavigate } from "react-router-dom";
import { FC, useState } from "react";
import PropertyCard from "../properties/PropertyCard";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import { Button } from "../ui/button";
import { normalizeProperty } from "@/func/properties";
import AuthModal from "../auth/AuthModal";

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
  const { t, isAuthenticated } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const properties = apiProperties
    ? apiProperties.slice(0, 4).map(normalizeProperty)
    : [];

  const onViewAll = () => {
    navigate("/properties");
  };
  // Fetch favorites if user is authenticated
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await propertiesAPI.getFavorites();
      return response.data;
    },
    enabled: isAuthenticated,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  // Get favorited property IDs
  const favoritePropertyIds =
    favoritesData?.data?.map((fav: any) => fav.favoriteable.id) || [];

  const favoriteMutation = useMutation({
    mutationFn: ({
      propertyId,
      isFavorited,
    }: {
      propertyId: number;
      isFavorited: boolean;
    }) => {
      if (isFavorited) {
        return propertiesAPI.removeFromFavorite(propertyId, "property");
      } else {
        return propertiesAPI.addToFavorite(propertyId, "property");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: t("fav.updated"),
        description: t("fav.added"),
      });
    },
    onError: (error) => {
      console.error("Error updating favorite:", error);
      toast({
        title: t("err.error"),
        description: t("fav.error.update"),
        variant: "destructive",
      });
    },
  });

  const handleFavorite = (propertyId: number) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const isFavorited = favoritePropertyIds.includes(propertyId);
    favoriteMutation.mutate({ propertyId, isFavorited });
  };
  if (isLoading) {
    return (
      <div className="text-center py-20 text-lg">{t("common.loading")}</div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("props.featured")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("props.discover")}</p>
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
                key={property.id}
                property={property}
                isFavorited={favoritePropertyIds.includes(property.id)}
                onFavorite={() => handleFavorite(property.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">{t("props.empty")}</h3>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 mt-8 flex justify-center">
        <Button
          variant="outline"
          className="rounded px-6 py-3 text-lg font-semibold"
          onClick={onViewAll}
        >
          {t("props.viewAll")}
        </Button>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </section>
  );
};

export default FeaturedProperties;
