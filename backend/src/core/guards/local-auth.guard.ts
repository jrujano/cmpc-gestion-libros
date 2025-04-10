import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Verificar si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Ejecutar la estrategia local por defecto
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Personalizar los mensajes de error
    if (err || !user) {
      let message = 'Credenciales inválidas';

      if (info instanceof Error) {
        message = info.message;
      } else if (info && info.message) {
        message = info.message;
      }

      // Log adicional para depuración (opcional)
      const request = context.switchToHttp().getRequest();
      console.warn(
        `Intento de login fallido para email: ${request.body.email}`,
      );

      throw new UnauthorizedException(message);
    }

    // Añadir datos adicionales al usuario si es necesario
    user.loginTimestamp = new Date();

    return user;
  }
}
