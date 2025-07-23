import IProperty from './IProperty';

export interface IPropertyRequest {
  id: number;
  office_id: number;
  requestable_type: string;
  requestable_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  target_id: number | null;
  created_at: string;
  updated_at: string;
  requestable: IProperty;
}

export interface IPropertyRequestsResponse {
  message: string;
  data: IPropertyRequest[];
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';
