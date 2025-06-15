
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface HomeSearchFormProps {
  t: (key: string) => string;
  isRTL: boolean;
  language: string;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  onSearch: () => void;
}

const HomeSearchForm: React.FC<HomeSearchFormProps> = ({
  t,
  isRTL,
  language,
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  onSearch,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-2xl animate-scale-in">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="relative">
        <Search
          className={`absolute top-3 ${
            isRTL ? "right-3" : "left-3"
          } h-5 w-5 text-gray-400`}
        />
        <Input
          placeholder={t("hero.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isRTL ? "pr-10" : "pl-10"} text-black h-12`}
        />
      </div>

      <Select
        value={selectedLocation}
        onValueChange={setSelectedLocation}
      >
        <SelectTrigger className="h-12 text-black">
          <SelectValue placeholder={t("hero.location")} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="dubai-marina">
            {language === "ar" ? "مرسى دبي" : "Dubai Marina"}
          </SelectItem>
          <SelectItem value="palm-jumeirah">
            {language === "ar" ? "نخلة جميرا" : "Palm Jumeirah"}
          </SelectItem>
          <SelectItem value="business-bay">
            {language === "ar" ? "خليج الأعمال" : "Business Bay"}
          </SelectItem>
          <SelectItem value="downtown">
            {language === "ar" ? "وسط المدينة" : "Downtown"}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="h-12 text-black">
          <SelectValue placeholder={t("hero.type")} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="apartment">
            {t("type.apartment")}
          </SelectItem>
          <SelectItem value="villa">{t("type.villa")}</SelectItem>
          <SelectItem value="land">{t("type.land")}</SelectItem>
          <SelectItem value="office">{t("type.office")}</SelectItem>
          <SelectItem value="shop">{t("type.shop")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger className="h-12 text-black">
          <SelectValue placeholder={t("hero.price")} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="0-500000">0 - 500K AED</SelectItem>
          <SelectItem value="500000-1000000">
            500K - 1M AED
          </SelectItem>
          <SelectItem value="1000000-2000000">1M - 2M AED</SelectItem>
          <SelectItem value="2000000+">2M+ AED</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Button
      onClick={onSearch}
      className="w-full h-12 text-lg font-semibold"
      size="lg"
    >
      {t("hero.searchBtn")}
    </Button>
  </div>
);

export default HomeSearchForm;
