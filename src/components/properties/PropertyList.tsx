
import React from "react";
import PropertyCard from "./PropertyCard";
import IProperty from "@/interfaces/IProperty";

interface PropertyListProps {
  properties: IProperty[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;
