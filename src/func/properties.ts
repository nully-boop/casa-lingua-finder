import IProperty from "@/interfaces/IProperty";
import { office, propertiesAPI } from "@/services/api";

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

export const fetchProperties = async () => {
  const res = await propertiesAPI.getProperties();
  return res.data.data;
};

export const fetchPropertiesOffice = async () => {
  const res = await office.getProperties();
  return res.data.data;
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
