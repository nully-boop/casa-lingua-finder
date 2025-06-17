import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "react-router-dom";

const PropertySearchBar = () => {
  const { t, language, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className={`absolute top-3 ${
              isRTL ? "right-3" : "left-3"
            } h-5 w-5 text-gray-400`}
          />
          <Input
            placeholder={t("hero.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isRTL ? "pr-10" : "pl-10"} h-12`}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 rtl:space-x-reverse h-12"
        >
          <Filter className="h-4 w-4" />
          <span>{t("search.filters")}</span>
        </Button>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 h-12">
            <SelectValue placeholder={t("search.sortBy")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="newest">{t("search.newest")}</SelectItem>
            <SelectItem value="oldest">{t("search.oldest")}</SelectItem>
            <SelectItem value="priceLow">{t("search.priceLow")}</SelectItem>
            <SelectItem value="priceHigh">{t("search.priceHigh")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PropertySearchBar;
