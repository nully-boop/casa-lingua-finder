import { useLanguage } from "@/contexts/LanguageContext";
import IProperty from "@/interfaces/IProperty";
import { useNavigate } from "react-router-dom";
import { FC } from "react";
import PropertyCard from "../properties/PropertyCard";

function normalizeProperty(apiProp: IProperty): IProperty {
  return {
    ...apiProp,
    price:
      typeof apiProp.price === "string"
        ? parseFloat(apiProp.price) || 0
        : apiProp.price,
    area:
      typeof apiProp.area === "string"
        ? parseFloat(apiProp.area) || 0
        : apiProp.area,
  };
}
interface IProps {
  apiProperties: IProperty[];
  isLoading: boolean;
  error: Error | null;
}

const FeaturedProperties: FC<IProps> = ({
  apiProperties,
  isLoading,
  error,
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const properties = apiProperties
    ? apiProperties.slice(0, 4).map(normalizeProperty)
    : [];

  const onViewAll = () => {
    navigate("/properties");
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "ar" ? "العقارات المميزة" : "Featured Properties"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar"
              ? "اكتشف أفضل العقارات المتاحة"
              : "Discover the best properties available"}
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-20 text-lg">
            {t("common.loading") || "Loading..."}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">
            {t("common.error") || "Error loading properties"}
          </div>
        )}

        {!isLoading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard property={property} />
            ))}
          </div>
        )}

        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">
              {language === "ar"
                ? "لا توجد عقارات متاحة"
                : "No properties available"}
            </h3>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 mt-8 flex justify-center">
        <button
          className="border border-primary bg-white text-primary rounded px-6 py-3 text-lg font-semibold hover:bg-primary hover:text-white transition-colors"
          onClick={onViewAll}
        >
          {language === "ar" ? "عرض جميع العقارات" : "View All Properties"}
        </button>
      </div>
    </section>
  );
};

export default FeaturedProperties;
