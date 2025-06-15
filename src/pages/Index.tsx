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
import { Search, MapPin, Bed, Bath, Square, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HomeSearchForm from "@/components/home/HomeSearchForm";
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
      <HeroSection
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        searchForm={
          <HomeSearchForm
            t={t}
            isRTL={isRTL}
            language={language}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onSearch={handleSearch}
          />
        }
      />

      {/* Featured Properties Section */}
      {isLoading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            {t('error.loadFailed')}
          </h2>
          <p className="text-muted-foreground">
            {t('error.tryAgain')}
          </p>
        </div>
      ) : (
        <FeaturedProperties
          properties={featuredProperties}
          isLoading={false}
          error={null}
          formatPrice={formatPrice}
          t={t}
          language={language}
          onPropertyClick={handlePropertyClick}
          onViewAll={() => navigate("/properties")}
        />
      )}


      {/* WhyUs Section */}
      <WhyUs />
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
