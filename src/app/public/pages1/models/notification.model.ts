export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  channel: string;
  user_id: number | null;
  alert_id: number | null;
  sensor_id: number | null;
  actuator_id: number | null;
  zone_id: number | null;
  created_at: string;
  read_at: string | null;
  updated_at: string;
}

export interface NewNotification {
  title: string;
  message: string;
  notification_type: string;
  is_read?: boolean;
  channel?: string;
  user_id?: number;
  alert_id?: number;
  sensor_id?: number;
  actuator_id?: number;
  zone_id?: number;
  read_at?: string;
}

export interface UpdateNotification {
  title?: string;
  message?: string;
  notification_type?: string;
  is_read?: boolean;
  channel?: string;
  user_id?: number;
  alert_id?: number;
  sensor_id?: number;
  actuator_id?: number;
  zone_id?: number;
  read_at?: string;
}
