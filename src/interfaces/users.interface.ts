export interface User {
  _id: string;
  id: string;
  name: string;
  password?: string;
  flags: number;
  toJSON?(): User;
}

export interface StudentUser {
  _id: string;
  phone: string;
  name: string;
  password?: string;
  department: string;
  grade: string;
  class: string;
  number: string;
  isVerified: boolean;
}


export interface Device {
  _id: string;
  deviceId: string;
  pushToken: string;
  pushPermission: boolean;
}

export enum UserFlags {
  general = 0 << 0,
  student = 1 << 1,
  busdriver = 1 << 2,
  teacher = 1 << 3,
  admin = 1 << 5,
}
