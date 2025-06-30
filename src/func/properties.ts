import IProperty from "@/interfaces/IProperty";

export const normalizeProperty = (property: IProperty): IProperty => {
  return {
    ...property,
    price:
      typeof property.price === "string"
        ? parseFloat(property.price) || 0
        : property.price,
    area:
      typeof property.area === "string"
        ? parseFloat(property.area) || 0
        : property.area,
  };
};



export const formatPriceSeller = (
  price: number,
  currency: string,
  forSale: boolean,
  t: (t?: string) => string
) => {
  const formattedPrice = price.toLocaleString();
  const period = forSale ? "" : t("m.month");
  return `${formattedPrice} ${currency}${period}`;
};
