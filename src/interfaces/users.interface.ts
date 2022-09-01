export interface User {
  _id: string;
  id: string;
  name: string
  password: string;
  flags: number;
}

export interface Device {
  _id: string;
  deviceId: string;
  pushToken: string
  pushPermission: boolean
}

