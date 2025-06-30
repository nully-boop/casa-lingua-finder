
import React from "react";
import IProperty from "@/interfaces/IProperty";
import PropertyList from "./PropertyList";

interface RelatedPropertiesProps {
  relatedProperties: IProperty[];
  language: string;
}

const RelatedProperties: React.FC<RelatedPropertiesProps> = ({
  relatedProperties,
  language,
}) => {
  if (relatedProperties.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {language === "ar" ? "عقارات مشابهة" : "Related Properties"}
        </h2>
        <p className="text-muted-foreground">
          {language === "ar"
            ? "عقارات أخرى قد تعجبك"
            : "Other properties you might be interested in"}
        </p>
      </div>
      <PropertyList
        properties={relatedProperties}
      />
    </div>
  );
};

export default RelatedProperties;
