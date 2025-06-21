import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react"; // Removed Star, PhoneCall
import { useLanguage } from "@/contexts/LanguageContext";
import IProperty from "@/interfaces/IProperty";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/func/properties";

interface PropertyCardProps {
  property: IProperty;
  isFavorited: boolean;
  onFavorite: () => void;
  onAdTypeFilter?: (adType: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorited,
  onFavorite,
  onAdTypeFilter,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/property/${property.id}`);
  };

  const handleAdTypeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAdTypeFilter) {
      onAdTypeFilter(property.ad_type);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in">
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

        <div className="absolute top-2 left-2 flex gap-2 rtl:left-auto rtl:right-4">
          <Button
            variant={property.ad_type === "sale" ? "sellColor" : "rentColor"}
            size="sm"
            className="px-2 py-0 h-6 text-xs font-medium rounded-full"
            onClick={handleAdTypeClick}
          >
            {property.ad_type === "sale" ? t("common.sale") : t("common.rent")}
          </Button>
          <Badge variant="secondary">{property.type}</Badge>
        </div>

        <Button
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm border border-border/50 p-1 rounded-full ${
            isFavorited
              ? "text-destructive hover:text-destructive/80"
              : "text-muted-foreground hover:text-foreground"
          } transition-colors`}
          onClick={onFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
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
