import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import { Search, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WhyUs from "@/components/WhyUs";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";

// Normalizes a property object from API to UI
function normalizeProperty(apiProp: any): IProperty {
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

const Index = () => {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Fetch properties from API
  const {
    data: apiProperties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: fetchProperties,
  });

  // Get first 4 properties for featured section
  const featuredProperties = apiProperties 
    ? apiProperties.slice(0, 4).map(normalizeProperty)
    : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);
    if (priceRange) params.set("price", priceRange);

    navigate(`/properties?${params.toString()}`);
  };

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = price.toLocaleString();
    return `${formattedPrice} ${currency}`;
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 animate-fade-in">
              {t("hero.subtitle")}
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl animate-scale-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search
                    className={`absolute top-3 ${
                      isRTL ? "right-3" : "left-3"
                    } h-5 w-5 text-gray-400`}
                  />
                  <Input
                    placeholder={t("hero.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${isRTL ? "pr-10" : "pl-10"} text-black h-12`}
                  />
                </div>

                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="h-12 text-black">
                    <SelectValue placeholder={t("hero.location")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="dubai-marina">
                      {language === "ar" ? "مرسى دبي" : "Dubai Marina"}
                    </SelectItem>
                    <SelectItem value="palm-jumeirah">
                      {language === "ar" ? "نخلة جميرا" : "Palm Jumeirah"}
                    </SelectItem>
                    <SelectItem value="business-bay">
                      {language === "ar" ? "خليج الأعمال" : "Business Bay"}
                    </SelectItem>
                    <SelectItem value="downtown">
                      {language === "ar" ? "وسط المدينة" : "Downtown"}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 text-black">
                    <SelectValue placeholder={t("hero.type")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="apartment">
                      {t("type.apartment")}
                    </SelectItem>
                    <SelectItem value="villa">{t("type.villa")}</SelectItem>
                    <SelectItem value="land">{t("type.land")}</SelectItem>
                    <SelectItem value="office">{t("type.office")}</SelectItem>
                    <SelectItem value="shop">{t("type.shop")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12 text-black">
                    <SelectValue placeholder={t("hero.price")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0-500000">0 - 500K AED</SelectItem>
                    <SelectItem value="500000-1000000">
                      500K - 1M AED
                    </SelectItem>
                    <SelectItem value="1000000-2000000">1M - 2M AED</SelectItem>
                    <SelectItem value="2000000+">2M+ AED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {t("hero.searchBtn")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
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

          {!isLoading && !error && featuredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in cursor-pointer"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="relative">
                    <img
                      src={property.images && property.images.length > 0 ? property.images[0].url : "https://placehold.co/400x300?text=No+Image"}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                      <Badge variant={property.ad_type === "sale" ? "default" : "secondary"}>
                        {property.ad_type === "sale" ? t("common.sale") : t("common.rent")}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {property.title}
                    </h3>

                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                        {property.rooms && property.rooms > 0 && (
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Bed className="h-4 w-4" />
                            <span>{property.rooms}</span>
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
                        {formatPrice(property.price, property.currency)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropertyClick(property.id);
                        }}
                      >
                        {t("common.view")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && featuredProperties.length === 0 && (
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
            variant="outline"
            size="lg"
            onClick={() => navigate("/properties")}
          >
            {language === "ar" ? "عرض جميع العقارات" : "View All Properties"}
          </Button>
        </div>
      </section>
      {/* WhyUs Section */}
      <WhyUs />
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
