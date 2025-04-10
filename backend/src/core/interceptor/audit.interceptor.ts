import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// Interceptores para Auditar Todas las Operaciones
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    // this.logger.log(`Request: ${method} ${url}`, JSON.stringify(body));
    this.logger.log(`Request: ${method} ${url}`);

    return next.handle().pipe(
      tap((response) => {
        // this.logger.log(`Response: ${method} ${url}`, JSON.stringify(response));
        this.logger.log(`Response: ${method} ${url}`);
      }),
    );
  }
}
