import { UserRole } from "../enums";

export interface User {
  id?: string;
  email: string;
  password: string;
  role: UserRole;
}
