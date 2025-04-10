import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { runSeeders } from './seeders';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      console.log('Conexión a la DB establecida');

      // Sincroniza modelos
      await this.sequelize.sync({ alter: true });

      // Ejecuta seeders (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        await runSeeders(this.sequelize);
      }
    } catch (error) {
      console.error('Error al inicializar DB:', error);
    }
  }
}
