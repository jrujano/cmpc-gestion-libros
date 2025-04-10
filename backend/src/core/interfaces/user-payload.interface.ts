import { UserRole } from '../../modules/users/models/user-role.enum';

export interface UserPayload {
  sub: number;
  email: string;
  name?: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
