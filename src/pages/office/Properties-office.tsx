import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import IProperty from "@/interfaces/IProperty";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertySearchBar from "@/components/properties/PropertySearchBar";
import { normalizeProperty } from "@/func/properties";
import HeaderOffice from "@/components/office/HeaderOffice";
import PropertyOfficeList from "@/components/office/PropertyOfficeList";
import { useToast } from "@/hooks/use-toast";
import { office } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import AccessDenied from "@/components/AccessDenied";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PropertiesOffice = () => {
  const { t, user, isAuthenticated, hasToken } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [filteredProperties, setFilteredProperties] = useState<IProperty[]>([]);
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(
    null
  );
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

  const { data: apiProperties, isLoading } = useQuery({
    queryKey: ["office-properties"],
    queryFn: async () => {
      if (!hasToken()) {
        throw new Error("No authentication token found");
      }
      return await office.getProperties();
    },
    enabled: isAuthenticated && hasToken(),
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  const properties = useMemo(() => {
    if (!apiProperties?.data) return [];
    return apiProperties.data.data.map(normalizeProperty);
  }, [apiProperties]);

  const handleDeleteProperty = async (property: IProperty) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingPropertyId(property.id);

    try {
      // TODO: Replace with actual API call
      // await deleteProperty(property.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Property Deleted",
        description: `${property.title} has been deleted successfully.`,
      });

      // TODO: Refresh the properties list or remove from local state
      // You might want to invalidate the query or refetch
    } catch (error) {
      alert(error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingPropertyId(null);
    }
  };

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

  // Check authentication
  if (!isAuthenticated || !hasToken() || user?.type !== "office") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderOffice />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t("office.properties") || "Properties"}
            </h1>
            <p className="text-muted-foreground">
              {t("office.manageProperties") ||
                "Manage and monitor your property listings"}
            </p>
          </div>
          <Button asChild>
            <Link to="/create-property">
              <Plus className="h-4 w-4 mr-2" />
              {t("dashboard.addProperty")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
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
            <PropertyOfficeList
              properties={filteredProperties}
              isLoading={isLoading}
              onDelete={handleDeleteProperty}
              deletingPropertyId={deletingPropertyId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesOffice;
