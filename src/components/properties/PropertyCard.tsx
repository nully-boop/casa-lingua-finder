import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-react"; // Removed Star, PhoneCall
import { useLanguage } from "@/contexts/LanguageContext";
import IProperty from "@/interfaces/IProperty";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: IProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/property/${property.id}`);
  };

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = price.toLocaleString();
    return `${formattedPrice} ${currency}`;
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in cursor-pointer"
      onClick={() => handlePropertyClick(property.id)}
    >
      <div className="relative">
        <img
          src={
            property.images && property.images.length > 0
              ? property.images[0].url
              : "https://placehold.co/400x300?text=No+Image"
          }
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <Badge
            variant={property.ad_type === "sale" ? "default" : "secondary"}
          >
            {property.ad_type === "sale" ? t("common.sale") : t("common.rent")}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
          <span>{property.location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {property.description}
        </p>
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
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button variant="outline" size="sm" onClick={handleViewClick}>
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
