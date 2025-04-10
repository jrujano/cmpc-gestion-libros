import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/models/user-role.enum';

/**
 * Decorador para asignar roles requeridos a un controlador o método
 * @param roles Lista de roles que tienen acceso
 * @example @Roles(UserRole.ADMIN)
 * @example @Roles(UserRole.ADMIN, UserRole.MODERATOR)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
