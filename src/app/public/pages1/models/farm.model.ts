export interface Farm {
  name: string;
  location: string;
  description: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NewFarm {
  name: string;
  location: string;
  description: string;
}
