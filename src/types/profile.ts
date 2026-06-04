import { SystemRole } from "./common";

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  role: keyof typeof SystemRole;
}
