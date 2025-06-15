
interface IProperty {
  id: number;
  title: string;
  titleAr?: string;
  type: string;
  price: number; // Always number after normalization
  currency: string;
  location: string;
  locationAr?: string;
  bedrooms?: number;
  rooms?: number;
  bathrooms: number;
  area: number; // Always number after normalization
  image?: string;
  forSale?: boolean;
  rating?: number;
  description: string;
  descriptionAr?: string;
  
  // API-specific fields (these can remain as received)
  owner_type?: string;
  owner_id?: number;
  ad_number?: string;
  latitude?: string;
  longitude?: string;
  floor_number?: number;
  ad_type?: string;
  status?: string;
  is_offer?: number;
  offer_expires_at?: string;
  views?: number;
  seller_type?: string;
  direction?: string;
  furnishing?: string;
  features?: string | null;
  is_available?: number;
  created_at?: string;
  updated_at?: string;
  owner?: any;
  images?: Array<{
    id: number;
    imageable_type: string;
    imageable_id: number;
    url: string;
    created_at: string;
    updated_at: string;
  }>;
  video?: {
    id: number;
    videoable_type: string;
    videoable_id: number;
    url: string;
    created_at: string;
    updated_at: string;
  } | null;
}

// API response interface for raw data before normalization
export interface IPropertyAPI {
  id: number;
  title: string;
  titleAr?: string;
  type: string;
  price: number | string; // Raw API data can be string
  currency: string;
  location: string;
  locationAr?: string;
  bedrooms?: number;
  rooms?: number;
  bathrooms: number;
  area: number | string; // Raw API data can be string
  image?: string;
  forSale?: boolean;
  rating?: number;
  description: string;
  descriptionAr?: string;
  
  // API-specific fields
  owner_type?: string;
  owner_id?: number;
  ad_number?: string;
  latitude?: string;
  longitude?: string;
  floor_number?: number;
  ad_type?: string;
  status?: string;
  is_offer?: number;
  offer_expires_at?: string;
  views?: number;
  seller_type?: string;
  direction?: string;
  furnishing?: string;
  features?: string | null;
  is_available?: number;
  created_at?: string;
  updated_at?: string;
  owner?: any;
  images?: Array<{
    id: number;
    imageable_type: string;
    imageable_id: number;
    url: string;
    created_at: string;
    updated_at: string;
  }>;
  video?: {
    id: number;
    videoable_type: string;
    videoable_id: number;
    url: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export default IProperty;
