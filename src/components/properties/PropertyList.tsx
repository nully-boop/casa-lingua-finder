
import React from "react";
import PropertyCard from "./PropertyCard";
import { Property } from "@/interfaces/IProperty";

interface PropertyListProps {
  properties: Property[];
  formatPrice: (price: number, currency: string, forSale: boolean) => string;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, formatPrice }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} formatPrice={formatPrice} />
      ))}
    </div>
  );
};

export default PropertyList;
