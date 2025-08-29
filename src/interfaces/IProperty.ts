import IOffice from "./IOffice";

interface IProperty {
  id: number;
  title: string;
  type: string;
  price: number; // Always number after normalization
  currency: string;
  location: string;
  address?: string;
  area_name?: string;
  city_name?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms: number;
  area: number;
  description: string;

  owner_type: string;
  owner_id: number;
  ad_number: string;
  latitude: string;
  longitude: string;
  floor_number: number;
  ad_type: string;
  position: string;
  is_offer: number;
  offer_expires_at: string;
  views: number;
  seller_type: string;
  direction: string;
  furnishing: string;
  features: string | null;
  is_available: number;
  created_at: string;
  updated_at: string;
  status?: "active" | "inactive" | "pending";
  owner: IOffice | null;
  images: Array<{
    id: number;
    imageable_type: string;
    imageable_id: number;
    url: string;
    created_at: string;
    updated_at: string;
  }>;
  video: {
    id: number;
    videoable_type: string;
    videoable_id: number;
    url: string;
    created_at: string;
    updated_at: string;
  } | null;
  relaitedproperties: IProperty[];
}

export default IProperty;
