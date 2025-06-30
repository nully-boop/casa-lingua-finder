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

interface PropertySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const PropertySearchBar: React.FC<PropertySearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className={`absolute top-3 ${
              isRTL ? "right-3" : "left-3"
            } h-5 w-5 text-muted-foreground`}
          />
          <Input
            placeholder={t("hero.search")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${isRTL ? "pr-10" : "pl-10"} h-12`}
          />
        </div>
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className={`flex items-center space-x-2 rtl:space-x-reverse h-12 ${
            showFilters ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>{t("search.filters")}</span>
        </Button>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48 h-12">
            <SelectValue placeholder={t("search.sortBy")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="newest">{t("search.newest")}</SelectItem>
            <SelectItem value="oldest">{t("search.oldest")}</SelectItem>
            <SelectItem value="priceLow">{t("search.priceLow")}</SelectItem>
            <SelectItem value="priceHigh">{t("search.priceHigh")}</SelectItem>
            <SelectItem value="mostViewed">{t("search.mostViewed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PropertySearchBar;
