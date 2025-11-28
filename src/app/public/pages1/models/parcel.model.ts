export interface Parcel {
  name: string;
  description: string;
  area_hectares: number;
  farm_id: number;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NewParcel {
  name: string;
  description: string;
  area_hectares: number;
  farm_id: number;
}
