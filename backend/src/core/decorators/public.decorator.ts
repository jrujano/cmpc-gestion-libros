import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para marcar rutas como públicas (sin autenticación)
 * @example @Public()
 * @example @Controller('auth')
 *          @Public()
 *          export class AuthController {...}
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
