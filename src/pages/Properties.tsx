import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertySearchBar from "@/components/properties/PropertySearchBar";
import PropertyList from "@/components/properties/PropertyList";
import { normalizeProperty } from "@/func/properties";
import { useToast } from "@/hooks/use-toast";

interface FavoriteItem {
  id: number;
  user_id: number;
  favoriteable_type: string;
  favoriteable_id: number;
  created_at: string;
  updated_at: string;
  favoriteable: {
    id: number;
    owner_type: string;
    owner_id: number;
    ad_number: string;
    title: string;
    description: string;
    price: string;
    location: string;
    latitude: string;
    longitude: string;
    area: string;
    floor_number: number;
    ad_type: string;
    type: string;
    status: string;
    is_offer: number;
    offer_expires_at: string;
    currency: string;
    views: number;
    bathrooms: number;
    rooms: number;
    seller_type: string;
    direction: string;
    furnishing: string;
    features: string | null;
    is_available: number;
    created_at: string;
    updated_at: string;
  };
}

const fetchProperties = async () => {
  const res = await propertiesAPI.getProperties();
  return res.data.data;
};

const Properties = () => {
  const { t, isAuthenticated, hasToken } = useLanguage();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [filteredProperties, setFilteredProperties] = useState<IProperty[]>([]);
  const [searchQuery, _setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedLocation, _setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const [selectedType, _setSelectedType] = useState(
    searchParams.get("type") || ""
  );
  const [priceRange, _setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortBy, _setSortBy] = useState("newest");
  const [favoriteProperties, setFavoriteProperties] = useState<number[]>([]);

  const { data: apiProperties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  // Fetch favorites if user is authenticated
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      const response = await propertiesAPI.getFavorites();
      return response.data;
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  // Handle favorites data when it changes
  useEffect(() => {
    if (favoritesData && Array.isArray(favoritesData)) {
      setFavoriteProperties(favoritesData.map((prop: FavoriteItem) => prop.id));
    }
  }, [favoritesData]);

  const properties = useMemo(() => {
    if (!apiProperties) return [];
    return apiProperties.map(normalizeProperty);
  }, [apiProperties]);

  useEffect(() => {
    if (!properties) return;

    let filtered: IProperty[] = [...properties];

    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((property) => property.type === selectedType);
    }

    filtered = filtered.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    switch (sortBy) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    setFilteredProperties(filtered);
  }, [
    properties,
    searchQuery,
    selectedLocation,
    selectedType,
    priceRange,
    sortBy,
  ]);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!isAuthenticated || !hasToken()) {
      toast({
        title: t("error.authRequired"),
        description: t("error.loginToFavorite"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if property is already favorited
      const isFavorited = favoriteProperties.includes(propertyId);

      if (isFavorited) {
        // Remove from favorites - use the correct API method
        await propertiesAPI.removeFromFavorite(propertyId);
        setFavoriteProperties((prev) => prev.filter((id) => id !== propertyId));
        toast({
          title: t("success.removed"),
          description: t("success.removedFromFavorites"),
        });
      } else {
        // Add to favorites - use the correct API method
        await propertiesAPI.addToFavorite(propertyId);
        setFavoriteProperties((prev) => [...prev, propertyId]);
        toast({
          title: t("success.added"),
          description: t("success.addedToFavorites"),
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: t("error.failed"),
        description: t("error.favoriteActionFailed"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <PropertySearchBar />
        <div className="flex gap-8">
          <PropertyFilters />
          <div className="flex-1">
            <PropertyList
              properties={filteredProperties}
              isLoading={isLoading}
              favoritedProperties={favoriteProperties}
              onFavorite={handleFavoriteToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
