import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import PropertyImageGallery from "@/components/properties/PropertyImageGallery";
import PropertyInfoCard from "@/components/properties/PropertyInfoCard";
import AgentSidebar from "@/components/properties/AgentSidebar";
import RelatedProperties from "@/components/properties/RelatedProperties";
import { AIChatDrawer } from "@/components/properties/AIChatDrawer";
import { useToast } from "@/hooks/use-toast";

const normalizeProperty = (property: IProperty): IProperty => {
  return {
    ...property,
    price:
      typeof property.price === "string"
        ? parseFloat(property.price) || 0
        : property.price,
    area:
      typeof property.area === "string"
        ? parseFloat(property.area) || 0
        : property.area,
  };
};

const formatPrice = (price: number, currency: string) => {
  if (currency === "USD") return `$${price.toLocaleString()}`;
  if (currency === "AED") return `${price.toLocaleString()} د.إ`;
  return `${price.toLocaleString()} ${currency}`;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const {
    data: propertyResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property-details", id],
    queryFn: () => propertiesAPI.getProperty(id!),
    enabled: !!id,
  });

  console.log("Property response:", propertyResponse);

  const propertyArray = propertyResponse?.data?.property || [];
  const relatedPropertiesRaw = propertyResponse?.data?.relaitedproperties || [];
  const isFavorited = propertyResponse?.data?.is_favorite === true;

  const rawProperty = propertyArray.find(
    (prop: any) => prop.id === parseInt(id!)
  );
  const property = rawProperty ? normalizeProperty(rawProperty) : null;

  const relatedProperties = relatedPropertiesRaw
    .map((prop: any) => normalizeProperty(prop))
    .filter((prop: IProperty) => prop.id !== parseInt(id!));

  console.log("Found property:", property);
  console.log("Related properties:", relatedProperties);
  console.log("Is favorited:", isFavorited);

  const favoriteMutation = useMutation({
    mutationFn: (propertyId: number) => {
      if (isFavorited) {
        // Remove from favorites
        return propertiesAPI.removeFromFavorite(propertyId);
      } else {
        // Add to favorites
        return propertiesAPI.addToFavorite(propertyId);
      }
    },
    onSuccess: () => {
      // Refetch the property details to get updated favorite status
      queryClient.invalidateQueries({ queryKey: ["property-details", id] });
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: isFavorited 
          ? (language === "ar" ? "تم إزالة العقار من المفضلة" : "Property removed from favorites")
          : (language === "ar" ? "تم إضافة العقار إلى المفضلة" : "Property added to favorites"),
      });
    },
    onError: (error) => {
      console.error("Error updating favorite:", error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" 
          ? "حدث خطأ في تحديث المفضلة" 
          : "Error updating favorites",
        variant: "destructive",
      });
    },
  });

  const handleFavorite = () => {
    if (property) {
      favoriteMutation.mutate(property.id);
    }
  };

  const priceString = property
    ? formatPrice(property.price, property.currency)
    : "";

  const amenities = [
    "Swimming Pool",
    "Gym & Fitness Center",
    "Covered Parking",
    "24/7 Security",
    "Balcony with View",
    "Built-in Wardrobes",
    "Central AC",
    "Concierge Service",
  ];
  const amenitiesAr = [
    "حمام سباحة",
    "صالة رياضية ومركز لياقة",
    "موقف مغطى",
    "أمن على مدار الساعة",
    "شرفة بإطلالة",
    "خزائن مدمجة",
    "تكييف مركزي",
    "خدمة الكونسيرج",
  ];

  const agent = {
    name: "Ahmed Al-Rashid",
    nameAr: "أحمد الراشد",
    phone: "+971 50 123 4567",
    email: "ahmed@casalingua.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  };

  const handleContactAgent = () => {
    alert(
      language === "ar"
        ? "سيتم التواصل مع الوكيل قريبا."
        : "The agent will be contacted soon."
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20 text-lg">
            {t("common.loading") || "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20 text-destructive">
            {t("common.error") || "Error loading property details"}
          </div>
        </div>
      </div>
    );
  }

  const images = property?.images || [];
  const propertyImages =
    images.length > 0
      ? images.map((img) => img.url)
      : ["https://placehold.co/400x300?text=No+Image"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft
            className={`h-4 w-4 ${
              isRTL ? "rotate-180" : ""
            } mr-2 rtl:mr-0 rtl:ml-2`}
          />
          {language === "ar" ? "العودة" : "Back"}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyImageGallery
              images={propertyImages}
              title={property?.title}
              adType={property?.ad_type}
              isFavorited={isFavorited}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              onFavorite={handleFavorite}
              onShare={() => {}}
              t={t}
            />

            <PropertyInfoCard
              property={{ ...property, priceString }}
              language={language}
              t={t}
              amenities={amenities}
              amenitiesAr={amenitiesAr}
              latitude={property?.latitude}
              longitude={property?.longitude}
            />
          </div>

          {/* Agent Info Sidebar */}
          <div className="space-y-6">
            <AgentSidebar
              agent={agent}
              language={language}
              onContact={handleContactAgent}
              onChat={() => setIsChatOpen(true)}
            />
          </div>
        </div>

        {/* Related Properties Section */}
        <RelatedProperties
          relatedProperties={relatedProperties}
          language={language}
          formatPrice={formatPrice}
        />
      </div>

      {property && (
        <AIChatDrawer
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          property={property}
        />
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetails;
