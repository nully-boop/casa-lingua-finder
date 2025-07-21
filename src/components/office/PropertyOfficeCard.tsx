import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Trash2, Edit, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import IProperty from "@/interfaces/IProperty";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: IProperty;
  onAdTypeFilter?: (adType: string) => void;
  onEdit?: (property: IProperty) => void;
  onDelete?: (property: IProperty) => void;
  isDeleting?: boolean;
}

const PropertyOfficeCard: React.FC<PropertyCardProps> = ({
  property,
  onAdTypeFilter,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const { t } = useLanguage();
  const { formatPrice, formatPricePerSqm } = useCurrency();
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(property);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(property);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in rounded-card bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={
            property.images && property.images.length > 0
              ? property.images[0].url
              : "https://placehold.co/400x300?text=No+Image"
          }
          alt={property.title}
          className="w-full h-56 object-cover rounded-t-card transition-transform duration-700 group-hover:scale-110"
        />
        {/* Shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 rtl:left-auto rtl:right-4">
          <Badge
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm border-0 ${
              property.ad_type === "sale"
                ? "bg-sellColor/90 text-sellColor-foreground hover:bg-sellColor"
                : "bg-rentColor/90 text-rentColor-foreground hover:bg-rentColor"
            } cursor-pointer transition-all duration-200`}
            onClick={handleAdTypeClick}
          >
            {property.ad_type === "sale" ? t("common.sale") : t("common.rent")}
          </Badge>

          {/* Property status badge */}
          <Badge
            className="px-3 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm border-0 bg-green-500/90 text-white"
          >
            {t("property.active") || "Active"}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 rtl:right-auto rtl:left-4">
          {onEdit && (
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={handleEditClick}
              title={t("common.edit") || "Edit"}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title={t("common.delete") || "Delete"}
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground leading-tight">
          {property.title}
        </h3>

        {/* Location and Property ID */}
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 text-gray-400" />
            <span className="text-sm">{property.location}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>ID: #{property.ad_number}</span>
            {property.created_at && (
              <span>
                {t("property.listed") || "Listed"}: {new Date(property.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Price and Property details - arranged like in the image */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-primary flex items-center gap-2">
              {formatPrice(property.price, property.currency)}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {formatPricePerSqm(
                property.price,
                property.area,
                property.currency
              )}
            </span>
          </div>

          {/* Property details badge - like in the image */}
          <div className="flex items-center gap-3 bg-slate-200/80 dark:bg-slate-700/50 px-4 py-2 rounded-full">
            {property.rooms && property.rooms > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Bed className="h-4 w-4" />
                <span>{property.rooms} BR</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Square className="h-4 w-4" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-button border-2 hover:bg-muted/50 transition-all duration-200"
            onClick={handleViewClick}
          >
            <Eye className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("common.view")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOfficeCard;
