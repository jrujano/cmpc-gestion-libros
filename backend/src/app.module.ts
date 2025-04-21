import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/shared/database/database.module'; // Ruta actualizada
import { BooksModule } from './modules/books/books.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customers/customer.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SalesModule } from "./modules/sales/sales.module";
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './core/interceptor/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    DatabaseModule,
    BooksModule,
    AuthModule,
    CustomerModule,
    InventoryModule,
    SalesModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
