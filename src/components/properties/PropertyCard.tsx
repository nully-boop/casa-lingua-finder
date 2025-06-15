import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property } from "@/interfaces/IProperty";

interface PropertyCardProps {
  property: Property;
  formatPrice: (price: number, currency: string, forSale: boolean) => string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, formatPrice }) => {
  const { t, language } = useLanguage();

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in"
      key={property.id}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={language === "ar" ? property.titleAr : property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <Badge variant={property.forSale ? "default" : "secondary"}>
            {property.forSale ? t("common.sale") : t("common.rent")}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white rounded-full p-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.rating}</span>
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
            {language === "ar" ? property.locationAr : property.location}
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
            {formatPrice(property.price, property.currency, property.forSale)}
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
  );
};

export default PropertyCard;
