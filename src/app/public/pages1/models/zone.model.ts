export interface Zone {
  name: string;
  crop_type: string;
  description: string;
  area_m2: number;
  parcel_id: number;
  id: number;
  created_at: string;
  updated_at: string;
}


export interface NewZone {
  name: string;
  crop_type: string;
  description: string;
  area_m2: number;
  parcel_id: number;
}
