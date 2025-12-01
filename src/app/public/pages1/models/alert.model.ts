export interface Alert {
  id: number;
  message: string;
  details: string;
  severity: string;
  is_read: boolean;
  zone_id: number | null;
  sensor_id: number | null;
  created_at: string;
  resolved_at: string | null;
  updated_at: string;
}

export interface NewAlert {
  message: string;
  details: string;
  severity: string;
  is_read?: boolean;
  zone_id?: number;
  sensor_id?: number;
  created_at?: string;
}

export interface UpdateAlert {
  message?: string;
  details?: string;
  severity?: string;
  is_read?: boolean;
  zone_id?: number;
  sensor_id?: number;
  resolved_at?: string | null;
}
