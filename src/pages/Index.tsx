import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyUs from "@/components/WhyUs";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";

const Index = () => {
  const { t } = useLanguage();

  const fetchProperties = async () => {
    const res = await propertiesAPI.getProperties();
    return res.data.data;
  };

  const {
    data: apiProperties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: fetchProperties,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Properties Section */}
      {isLoading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            {t("error.loadFailed")}
          </h2>
          <p className="text-muted-foreground">{t("error.tryAgain")}</p>
        </div>
      ) : (
        <FeaturedProperties
          apiProperties={apiProperties}
          isLoading={false}
          error={null}
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
