import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyUs from "@/components/WhyUs";
import { propertiesAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { t} = useLanguage();

  const fetchProperties = async () => {
    const res = await propertiesAPI.getProperties();
    return res.data.data;
  };

  const {
    data: apiProperties,
    isLoading,
    isError,
    error,
    refetch,
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
      ) : isError ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">
            {t("error.loadFailed", { ns: "common" }) ||
              "Failed to Load Properties"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {(error as Error)?.message
              ? t("error.specificLoadFailed", {
                  ns: "common",
                  message: (error as Error).message,
                })
              : t("error.tryAgain", { ns: "common" }) ||
                "Please try again later."}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RotateCw className="h-4 w-4 mr-2" />
            {t("common.retry") || "Retry"}
          </Button>
        </div>
      ) : (
        <FeaturedProperties
          apiProperties={apiProperties}
          isLoading={false}
          error={isError}
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
