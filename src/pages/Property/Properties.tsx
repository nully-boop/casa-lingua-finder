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
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [selectedAdType, setSelectedAdType] = useState(
    searchParams.get("adType") || "all"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
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
      setFavoriteProperties(
        favoritesData.map((prop: FavoriteItem) => prop.favoriteable_id)
      );
    }
  }, [favoritesData]);

  const properties = useMemo(() => {
    if (!apiProperties) return [];
    return apiProperties.map(normalizeProperty);
  }, [apiProperties]);

  // Get unique values for filters from API data
  const filterOptions = useMemo(() => {
    if (!properties.length)
      return {
        locations: [],
        types: [],
        adTypes: [],
        priceRange: [0, 5000000] as [number, number],
      };

    const locations = [
      ...new Set(properties.map((p) => p.location).filter(Boolean) as string[]),
    ];
    const types = [...new Set(properties.map((p) => p.type).filter(Boolean) as string[])];
    const adTypes = [
      ...new Set(properties.map((p) => p.ad_type).filter(Boolean) as string[]),
    ];
    const prices = properties.map((p) => p.price).filter((p) => p > 0);
    const maxPrice = prices.length ? Math.max(...prices) : 5000000;

    return {
      locations: locations.sort(),
      types: types.sort(),
      adTypes: adTypes.sort(),
      priceRange: [0, Math.ceil(maxPrice / 100000) * 100000] as [
        number,
        number
      ],
    };
  }, [properties]);

  useEffect(() => {
    if (!properties) return;

    let filtered: IProperty[] = [...properties];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Property type filter
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (property) => property.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Ad type filter (sale/rent)
    if (selectedAdType && selectedAdType !== "all") {
      filtered = filtered.filter(
        (property) =>
          property.ad_type.toLowerCase() === selectedAdType.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "mostViewed":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProperties(filtered);
  }, [
    properties,
    searchQuery,
    selectedLocation,
    selectedType,
    selectedAdType,
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
        await propertiesAPI.removeFromFavorite(propertyId, "property");
        setFavoriteProperties((prev) => prev.filter((id) => id !== propertyId));
        toast({
          title: t("success.removed"),
          description: t("success.removedFromFavorites"),
        });
      } else {
        // Add to favorites - use the correct API method
        await propertiesAPI.addToFavorite(propertyId, "property");
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
        <PropertySearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        <div className="flex gap-8">
          <PropertyFilters
            showFilters={showFilters}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedAdType={selectedAdType}
            onAdTypeChange={setSelectedAdType}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            filterOptions={filterOptions}
            onClearFilters={() => {
              setSearchQuery("");
              setSelectedLocation("all");
              setSelectedType("all");
              setSelectedAdType("all");
              setPriceRange([0, filterOptions.priceRange[1] || 1000000]);
              setSortBy("newest");
            }}
          />
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
