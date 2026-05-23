import type { TRole } from "../../types";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: TRole;
  created_at: Date;
  updated_at: Date;
}
