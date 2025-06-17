import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertySearchBar from "@/components/properties/PropertySearchBar";
import PropertyList from "@/components/properties/PropertyList";

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
  return res.data.data;
};

const Properties = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

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

  const {
    data: apiProperties,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

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


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <PropertySearchBar />
        <div className="flex gap-8">
          <PropertyFilters />

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
            {isError && (
              <div className="text-center py-20">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-destructive">
                  {t("error.loadFailed", { ns: "common" }) || "Error Loading Properties"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {(error as Error)?.message
                    ? t("error.specificLoadFailed", { ns: "common", message: (error as Error).message })
                    : t("error.tryAgain", { ns: "common" }) || "Please try again later."}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  <RotateCw className="h-4 w-4 mr-2" />
                  {t("common.retry") || "Retry"}
                </Button>
              </div>
            )}
            {!isLoading && !isError && (
              <PropertyList properties={filteredProperties} />
            )}
            {filteredProperties.length === 0 && !isLoading && !isError && (
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
