
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";
import IProperty from "@/interfaces/IProperty";
import Header from "@/components/Header";
import PropertyMap from "@/components/PropertyMap";
import PropertyList from "@/components/properties/PropertyList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Building,
  CheckCircle,
} from "lucide-react";
import Footer from "@/components/Footer";

// Helper function to normalize property data for UI consistency
const normalizeProperty = (property: any): IProperty => {
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

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isFavorited, setIsFavorited] = React.useState(false);

  // Fetch property details from API
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

  // Handle the API response format
  const propertyArray = propertyResponse?.data?.property || [];
  const relatedPropertiesRaw = propertyResponse?.data?.relaitedproperties || [];
  
  // Find the specific property by ID from the array
  const rawProperty = propertyArray.find((prop: any) => prop.id === parseInt(id!));
  const property = rawProperty ? normalizeProperty(rawProperty) : null;
  
  // Normalize related properties and filter out the current property
  const relatedProperties = relatedPropertiesRaw
    .map((prop: any) => normalizeProperty(prop))
    .filter((prop: IProperty) => prop.id !== parseInt(id!));

  console.log("Found property:", property);
  console.log("Related properties:", relatedProperties);

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = price.toLocaleString();
    return `${formattedPrice} ${currency}`;
  };

  const handleContactAgent = () => {
    console.log("Contact agent clicked");
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

  const images = property.images || [];
  const propertyImages =
    images.length > 0
      ? images.map((img) => img.url)
      : ["https://placehold.co/400x300?text=No+Image"];

  // Mock amenities for now since API doesn't provide them
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

  // Mock agent data since API doesn't provide it
  const agent = {
    name: "Ahmed Al-Rashid",
    nameAr: "أحمد الراشد",
    phone: "+971 50 123 4567",
    email: "ahmed@casalingua.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  };

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
            {/* Main Image */}
            <div className="relative">
              <img
                src={propertyImages[selectedImage]}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
                <Badge variant={property.ad_type === "sale" ? "default" : "secondary"}>
                  {property.ad_type === "sale" ? t("common.sale") : t("common.rent")}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorited ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {propertyImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {propertyImages.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Property ${index + 1}`}
                    className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                      <span>{property.location}</span>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(property.price, property.currency)}
                    </div>
                  </div>

                  <Separator />

                  {/* Property Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.rooms && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Bed className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-semibold">{property.rooms}</div>
                          <div className="text-sm text-muted-foreground">
                            {language === "ar" ? "غرف النوم" : "Bedrooms"}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">
                          {property.bathrooms}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "الحمامات" : "Bathrooms"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{property.area} m²</div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "المساحة" : "Area"}
                        </div>
                      </div>
                    </div>
                    {property.floor_number && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-semibold">
                            Floor {property.floor_number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === "ar" ? "الطابق" : "Floor"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Tabs for Location, Description, and Amenities */}
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="description">
                        {language === "ar" ? "الوصف" : "Description"}
                      </TabsTrigger>
                      <TabsTrigger value="amenities">
                        {language === "ar" ? "المرافق" : "Amenities"}
                      </TabsTrigger>
                      <TabsTrigger value="location">
                        {language === "ar" ? "الموقع" : "Location"}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {property.description}
                      </p>
                    </TabsContent>

                    <TabsContent value="amenities" className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {(language === "ar" ? amenitiesAr : amenities).map(
                          (amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 rtl:space-x-reverse"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{amenity}</span>
                            </div>
                          )
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="space-y-4">
                      <PropertyMap
                        address={property.location}
                        className="w-full"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Info Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={agent.image}
                    alt={language === "ar" ? agent.nameAr : agent.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">
                    {language === "ar" ? agent.nameAr : agent.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "ar" ? "وكيل عقاري" : "Real Estate Agent"}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agent.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleContactAgent} className="w-full">
                    <Phone className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === "ar" ? "اتصل الآن" : "Call Now"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleContactAgent}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === "ar" ? "إرسال رسالة" : "Send Message"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {language === "ar" ? "حجز موعد" : "Schedule Visit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Properties Section */}
        {relatedProperties.length > 0 && (
          <div className="mt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {language === "ar" ? "عقارات مشابهة" : "Related Properties"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar" 
                  ? "عقارات أخرى قد تعجبك" 
                  : "Other properties you might be interested in"}
              </p>
            </div>
            <PropertyList 
              properties={relatedProperties} 
              formatPrice={formatPrice}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetails;
