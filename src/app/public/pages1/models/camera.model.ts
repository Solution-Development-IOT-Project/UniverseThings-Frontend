export interface Camera {
  id: number;
  name: string;
  camera_type: string;
  model: string;
  is_active: boolean;
  location_description: string;
  zone_id: number;
  created_at: string;
  updated_at: string;
}

export interface NewCamera {
  name: string;
  camera_type: string;
  model: string;
  is_active: boolean;
  location_description: string;
  zone_id: number;
}

export interface UpdateCamera {
  name?: string;
  camera_type?: string;
  model?: string;
  is_active?: boolean;
  location_description?: string;
  zone_id?: number;
}

export interface CameraImage {
  id: number;
  camera_id: number;
  file_path: string;
  image_type: string;
  metadata: string;
  analysis_result: string;
  captured_at: string;
  created_at: string;
  updated_at: string;
}

export interface NewCameraImage {
  file_path: string;
  image_type: string;
  metadata: string;
  analysis_result: string;
  camera_id: number;
  captured_at: string;
}

export interface UpdateCameraImage {
  file_path?: string;
  image_type?: string;
  metadata?: string;
  analysis_result?: string;
  camera_id?: number;
  captured_at?: string;
}
