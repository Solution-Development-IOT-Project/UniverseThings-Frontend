export interface Device {
    id: number;
    name: string;
    device_type: string;
    serial_number: string;
    firmware_version: string;
    is_online: boolean;
    last_seen: string; // Consider using Date type and transforming
    zone_id: number;
    created_at: string; // Consider using Date type and transforming
    updated_at: string; // Consider using Date type and transforming
}

export interface NewDevice {
    name: string;
    device_type: string;
    serial_number: string;
    firmware_version: string;
    is_online: boolean;
    last_seen?: string; // Made optional
    zone_id: number;
}

export interface UpdateDevice {
    name?: string;
    device_type?: string;
    serial_number?: string;
    firmware_version?: string;
    is_online?: boolean;
    last_seen?: string;
    zone_id?: number;
}

