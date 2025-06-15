
import React from "react";
import FeaturedPropertyCard from "./FeaturedPropertyCard";
import IProperty from "@/interfaces/IProperty";

interface FeaturedPropertiesProps {
  properties: IProperty[];
  isLoading: boolean;
  error: any;
  formatPrice: (price: number, currency: string) => string;
  t: (key: string) => string;
  language: string;
  onPropertyClick: (id: number) => void;
  onViewAll: () => void;
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  isLoading,
  error,
  formatPrice,
  t,
  language,
  onPropertyClick,
  onViewAll,
}) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {properties.map(property => (
            <FeaturedPropertyCard
              key={property.id}
              property={property}
              formatPrice={formatPrice}
              t={t}
              language={language}
              onClick={() => onPropertyClick(property.id)}
            />
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

export default FeaturedProperties;
