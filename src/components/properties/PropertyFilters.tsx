
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

interface PropertyFiltersProps {
  show: boolean;
  language: string;
  t: (key: string) => string;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  clearFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  show,
  language,
  t,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  clearFilters,
}) => {
  if (!show) return null;
  return (
    <div className="w-80 space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t("search.filters")}</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              {t("search.clearFilters")}
            </Button>
          </div>

          <div className="space-y-4">
            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("hero.location")}
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("hero.location")} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">
                    {language === "ar"
                      ? "جميع المواقع"
                      : "All Locations"}
                  </SelectItem>
                  <SelectItem value="dubai-marina">
                    {language === "ar" ? "مرسى دبي" : "Dubai Marina"}
                  </SelectItem>
                  <SelectItem value="palm-jumeirah">
                    {language === "ar" ? "نخلة جميرا" : "Palm Jumeirah"}
                  </SelectItem>
                  <SelectItem value="business-bay">
                    {language === "ar"
                      ? "خليج الأعمال"
                      : "Business Bay"}
                  </SelectItem>
                  <SelectItem value="jlt">
                    {language === "ar" ? "أبراج بحيرة الجميرا" : "JLT"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("hero.type")}
              </label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("hero.type")} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">
                    {language === "ar" ? "جميع الأنواع" : "All Types"}
                  </SelectItem>
                  <SelectItem value="apartment">
                    {t("type.apartment")}
                  </SelectItem>
                  <SelectItem value="villa">
                    {t("type.villa")}
                  </SelectItem>
                  <SelectItem value="land">{t("type.land")}</SelectItem>
                  <SelectItem value="office">
                    {t("type.office")}
                  </SelectItem>
                  <SelectItem value="shop">{t("type.shop")}</SelectItem>
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
                      setPriceRange(val as [number, number]);
                    }
                  }}
                  max={5000000}
                  min={0}
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
