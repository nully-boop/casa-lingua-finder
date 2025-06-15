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

// Normalizes a property object from API to UI
function normalizeProperty(apiProp: IProperty): IProperty {
  return {
    ...apiProp,
    price:
      typeof apiProp.price === "string"
        ? parseFloat(apiProp.price) || 0
        : apiProp.price,
    area:
      typeof apiProp.area === "string"
        ? parseFloat(apiProp.area) || 0
        : apiProp.area,
  };
}

const fetchProperties = async () => {
  const res = await propertiesAPI.getProperties();
  // API gives response as { current_page, data, ... }
  return res.data.data;
};

const Properties = () => {
  const { t, language, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  // Local state for filters/controls
  const [filteredProperties, setFilteredProperties] = useState<IProperty[]>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch properties data from API
  const {
    data: apiProperties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  // Memoize the normalized properties for performance
  const properties = useMemo(() => {
    if (!apiProperties) return [];
    return apiProperties.map(normalizeProperty);
  }, [apiProperties]);

  // Filtering logic (reuses existing code, now with API data)
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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedType("");
    setPriceRange([0, 5000000]);
    setSortBy("newest");
  };

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = price.toLocaleString();
    return `${formattedPrice} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <PropertySearchBar
          t={t}
          isRTL={isRTL}
          language={language}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="flex gap-8">
          <PropertyFilters
            show={showFilters}
            language={language}
            t={t}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            clearFilters={clearFilters}
          />

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {t("search.results")} ({filteredProperties.length})
              </h2>
            </div>
            {isLoading && (
              <div className="text-center py-20 text-lg">
                {t("common.loading") || "Loading..."}
              </div>
            )}
            {error && (
              <div className="text-center py-20 text-destructive">
                {t("common.error") || "Error loading properties"}
              </div>
            )}
            {!isLoading && !error && (
              <PropertyList
                properties={filteredProperties}
                formatPrice={formatPrice}
              />
            )}
            {filteredProperties.length === 0 && !isLoading && !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === "ar"
                    ? "لم يتم العثور على عقارات"
                    : "No properties found"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "جرب تعديل المرشحات للحصول على نتائج أفضل"
                    : "Try adjusting your filters for better results"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
