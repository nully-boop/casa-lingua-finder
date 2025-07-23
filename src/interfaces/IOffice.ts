interface IOffice {
  id: number;
  name: string;
  description?: string;
  location?: string;
  phone: string;
  type: string;
  status: string;
  free_ads: number;
  followers_count: number;
  views: number;
  image?: { url: string };
  document: { url: string };
  created_at: string;
  updated_at: string;
}

export default IOffice;
