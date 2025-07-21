
import React, { useState } from "react";
import IProperty from "@/interfaces/IProperty";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import PropertyOfficeCard from "./PropertyOfficeCard";

interface PropertyOfficeListProps {
  properties: IProperty[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit?: (property: IProperty) => void;
  onDelete?: (property: IProperty) => void;
  deletingPropertyId?: number | null;
}

const PropertyOfficeList: React.FC<PropertyOfficeListProps> = ({
  properties,
  isLoading,
  error,
  onEdit,
  onDelete,
  deletingPropertyId,
}) => {
  const { t } = useLanguage();
  const [adTypeFilter, setAdTypeFilter] = useState<string | null>(null);

  const handleAdTypeFilter = (adType: string) => {
    setAdTypeFilter(adTypeFilter === adType ? null : adType);
  };

  const filteredProperties = adTypeFilter
    ? properties.filter((property) => property.ad_type === adTypeFilter)
    : properties;

  return (
    <div>
      {/* Ad Type Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={adTypeFilter === null ? "default" : "outline"}
          onClick={() => setAdTypeFilter(null)}
        >
          {t("common.all")}
        </Button>
        <Button
          variant={adTypeFilter === "sale" ? "sellColor" : "outline"}
          onClick={() => handleAdTypeFilter("sale")}
        >
          {t("common.sale")}
        </Button>
        <Button
          variant={adTypeFilter === "rent" ? "rentColor" : "outline"}
          onClick={() => handleAdTypeFilter("rent")}
        >
          {t("common.rent")}
        </Button>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyOfficeCard
            key={property.id}
            property={property}
            onAdTypeFilter={handleAdTypeFilter}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingPropertyId === property.id}
          />
        ))}
      </div>

      {/* Loading and Error States */}
      {isLoading && <div className="text-center py-8">{t("common.loading")}</div>}
      {error && (
        <div className="text-center py-8 text-red-500">
          {t("error.failedToLoadProperties")}
        </div>
      )}
      {!isLoading && !error && filteredProperties.length === 0 && (
        <div className="text-center py-8">{t("search.noResults")}</div>
      )}
    </div>
  );
};

export default PropertyOfficeList;
