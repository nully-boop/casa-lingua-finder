
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const API_URL = "/user/properties";

// Normalizes a property object from API to UI
function normalizeProperty(apiProp: any) {
  return {
    id: apiProp.id,
    title: apiProp.title,
    titleAr: apiProp.title_ar || apiProp.title, // fallback to English if not exists
    type: apiProp.type,
    price: parseFloat(apiProp.price),
    currency: apiProp.currency || "AED",
    location: apiProp.location,
    locationAr: apiProp.location_ar || apiProp.location, // fallback
    bedrooms: apiProp.rooms ?? 0,
    bathrooms: apiProp.bathrooms ?? 0,
    area: apiProp.area ? parseFloat(apiProp.area) : 0,
    image:
      (apiProp.images && apiProp.images[0] && apiProp.images[0].url) ||
      "https://placehold.co/400x300?text=No+Image",
    forSale: apiProp.ad_type === "sale" || apiProp.forSale || false,
    rating: 4.5, // Placeholder until API supports ratings
    description: apiProp.description || "",
    descriptionAr: apiProp.description_ar || apiProp.description || "",
  };
}

const fetchProperties = async () => {
  const res = await api.get(API_URL);
  // API gives response as { current_page, data, ... }
  return res.data.data;
};

const Properties = () => {
  const { t, language, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  // Local state for filters/controls
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || ""
  );
  const [priceRange, setPriceRange] = useState([0, 5000000]);
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

    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (property.titleAr &&
            property.titleAr.includes(searchQuery)) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (property.locationAr && property.locationAr.includes(searchQuery))
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((property) =>
        property.location
          .toLowerCase()
          .includes(selectedLocation.toLowerCase())
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

  const formatPrice = (price: number, currency: string, forSale: boolean) => {
    const formattedPrice = price.toLocaleString();
    const period = forSale ? "" : language === "ar" ? "/شهر" : "/month";
    return `${formattedPrice} ${currency}${period}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className={`absolute top-3 ${
                  isRTL ? "right-3" : "left-3"
                } h-5 w-5 text-gray-400`}
              />
              <Input
                placeholder={t("hero.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? "pr-10" : "pl-10"} h-12`}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 rtl:space-x-reverse h-12"
            >
              <Filter className="h-4 w-4" />
              <span>{t("search.filters")}</span>
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder={t("search.sortBy")} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="newest">{t("search.newest")}</SelectItem>
                <SelectItem value="oldest">{t("search.oldest")}</SelectItem>
                <SelectItem value="priceLow">{t("search.priceLow")}</SelectItem>
                <SelectItem value="priceHigh">
                  {t("search.priceHigh")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{t("search.filters")}</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      {t("search.clearFilters")}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Location Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("hero.location")}
                      </label>
                      <Select
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("hero.location")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="">
                            {language === "ar"
                              ? "جميع المواقع"
                              : "All Locations"}
                          </SelectItem>
                          <SelectItem value="dubai-marina">
                            {language === "ar" ? "مرسى دبي" : "Dubai Marina"}
                          </SelectItem>
                          <SelectItem value="palm-jumeirah">
                            {language === "ar" ? "نخلة جميرا" : "Palm Jumeirah"}
                          </SelectItem>
                          <SelectItem value="business-bay">
                            {language === "ar"
                              ? "خليج الأعمال"
                              : "Business Bay"}
                          </SelectItem>
                          <SelectItem value="jlt">
                            {language === "ar" ? "أبراج بحيرة الجميرا" : "JLT"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("hero.type")}
                      </label>
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("hero.type")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="">
                            {language === "ar" ? "جميع الأنواع" : "All Types"}
                          </SelectItem>
                          <SelectItem value="apartment">
                            {t("type.apartment")}
                          </SelectItem>
                          <SelectItem value="villa">
                            {t("type.villa")}
                          </SelectItem>
                          <SelectItem value="land">{t("type.land")}</SelectItem>
                          <SelectItem value="office">
                            {t("type.office")}
                          </SelectItem>
                          <SelectItem value="shop">{t("type.shop")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("search.priceRange")}
                      </label>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={5000000}
                          min={0}
                          step={50000}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>{priceRange[0].toLocaleString()} AED</span>
                          <span>{priceRange[1].toLocaleString()} AED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {t("search.results")} ({filteredProperties.length})
              </h2>
            </div>

            {isLoading && (
              <div className="text-center py-20 text-lg">{t("common.loading") || "Loading..."}</div>
            )}
            {error && (
              <div className="text-center py-20 text-destructive">
                {t("common.error") || "Error loading properties"}
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property: any) => (
                  <Card
                    key={property.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in"
                  >
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={
                          language === "ar" ? property.titleAr : property.title
                        }
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                        <Badge
                          variant={property.forSale ? "default" : "secondary"}
                        >
                          {property.forSale
                            ? t("common.sale")
                            : t("common.rent")}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white rounded-full p-2">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {property.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {language === "ar" ? property.titleAr : property.title}
                      </h3>

                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                        <span>
                          {language === "ar"
                            ? property.locationAr
                            : property.location}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {language === "ar"
                          ? property.descriptionAr
                          : property.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              <Bed className="h-4 w-4" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Square className="h-4 w-4" />
                            <span>{property.area} m²</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(
                            property.price,
                            property.currency,
                            property.forSale
                          )}
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button variant="outline" size="sm">
                            {t("common.view")}
                          </Button>
                          <Button size="sm">{t("common.contact")}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
