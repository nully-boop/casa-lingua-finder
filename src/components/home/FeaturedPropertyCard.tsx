
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import IProperty from "@/interfaces/IProperty";

interface FeaturedPropertyCardProps {
  property: IProperty;
  formatPrice: (price: number, currency: string) => string;
  t: (key: string) => string;
  language: string;
  onClick: () => void;
}

const FeaturedPropertyCard: React.FC<FeaturedPropertyCardProps> = ({
  property,
  formatPrice,
  t,
  language,
  onClick,
}) => (
  <Card
    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in cursor-pointer"
    onClick={onClick}
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
          onClick={e => {
            e.stopPropagation();
            onClick();
          }}
        >
          {t("common.view")}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default FeaturedPropertyCard;
