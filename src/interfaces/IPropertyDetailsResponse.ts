
export interface IPropertyImage {
  id: number;
  imageable_type: string;
  imageable_id: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface IPropertyVideo {
  id: number;
  videoable_type: string;
  videoable_id: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface IPropertyAPI {
  id: number;
  owner_type: string;
  owner_id: number;
  ad_number: string;
  title: string;
  description: string;
  price: string;
  location: string;
  latitude: string;
  longitude: string;
  area: string;
  floor_number: number;
  ad_type: string;
  type: string;
  status: string;
  is_offer: number;
  offer_expires_at: string;
  currency: string;
  views: number;
  bathrooms: number;
  rooms: number;
  seller_type: string;
  direction: string;
  furnishing: string;
  features: string | null;
  is_available: number;
  created_at: string;
  updated_at: string;
  owner?: any;
  images?: IPropertyImage[];
  video?: IPropertyVideo | null;
}

export interface IPropertyDetailsResponse {
  property: IPropertyAPI;
  relaitedproperties: IPropertyAPI[];
}
