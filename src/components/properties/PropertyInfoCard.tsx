
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Building,
  CheckCircle,
} from "lucide-react";
import PropertyMap from "@/components/PropertyMap";

interface PropertyInfoCardProps {
  property: any;
  language: string;
  t: (key: string) => string;
  amenities: string[];
  amenitiesAr: string[];
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({
  property,
  language,
  t,
  amenities,
  amenitiesAr,
}) => {
  return (
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
              {property.priceString}
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
  );
};

export default PropertyInfoCard;
