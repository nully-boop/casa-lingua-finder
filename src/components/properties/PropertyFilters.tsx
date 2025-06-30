import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterOptions {
  locations: string[];
  types: string[];
  adTypes: string[];
  priceRange: [number, number];
}

interface PropertyFiltersProps {
  showFilters: boolean;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedAdType: string;
  onAdTypeChange: (adType: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  filterOptions: FilterOptions;
  onClearFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  showFilters,
  selectedLocation,
  onLocationChange,
  selectedType,
  onTypeChange,
  selectedAdType,
  onAdTypeChange,
  priceRange,
  onPriceRangeChange,
  filterOptions,
  onClearFilters,
}) => {
  const { t, language } = useLanguage();

  if (!showFilters) return null;
  return (
    <div className="w-80 space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t("search.filters")}</h3>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              {t("search.clearFilters")}
            </Button>
          </div>

          <div className="space-y-4">
            {/* Ad Type Filter (Sale/Rent) */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("search.adType")}
              </label>
              <Select value={selectedAdType} onValueChange={onAdTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("search.selectAdType")} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">{t("search.allAdTypes")}</SelectItem>
                  {filterOptions.adTypes.map((adType) => (
                    <SelectItem key={adType} value={adType}>
                      {adType === "sale" ? t("common.sale") : t("common.rent")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("hero.location")}
              </label>
              <Select
                value={selectedLocation}
                onValueChange={onLocationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("hero.location")} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">
                    {language === "ar" ? "جميع المواقع" : "All Locations"}
                  </SelectItem>
                  {filterOptions.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("hero.type")}
              </label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("hero.type")} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">
                    {language === "ar" ? "جميع الأنواع" : "All Types"}
                  </SelectItem>
                  {filterOptions.types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("search.priceRange")}
              </label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={(val) => {
                    if (Array.isArray(val) && val.length === 2) {
                      onPriceRangeChange(val as [number, number]);
                    }
                  }}
                  max={filterOptions.priceRange[1]}
                  min={filterOptions.priceRange[0]}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{priceRange[0].toLocaleString()} AED</span>
                  <span>{priceRange[1].toLocaleString()} AED</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyFilters;
