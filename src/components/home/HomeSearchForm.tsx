import { useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const HomeSearchForm = () => {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);
    if (priceRange) params.set("price", priceRange);

    navigate(`/properties?${params.toString()}`);
  };

  return (
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

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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
            <SelectItem value="apartment">{t("type.apartment")}</SelectItem>
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
            <SelectItem value="500000-1000000">500K - 1M AED</SelectItem>
            <SelectItem value="1000000-2000000">1M - 2M AED</SelectItem>
            <SelectItem value="2000000+">2M+ AED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full h-12 text-lg font-semibold"
        size="lg"
      >
        {t("hero.searchBtn")}
      </Button>
    </div>
  );
};

export default HomeSearchForm;
