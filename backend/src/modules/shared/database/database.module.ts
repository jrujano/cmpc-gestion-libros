import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize'; // Import directly from sequelize
import { DatabaseService } from './database.service';
import * as dotenv from 'dotenv';

// Exportamos la instancia de Sequelize directamente
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '.123456a',
  database: process.env.DB_NAME || 'cmpc_libros_c',
  logging: false,
});

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        logging: false, // Aquí desactivas los logs de SQL
        sync: {
          force: false, // ¡Cuidado! true borra y recrea las tablas en cada inicio
          alter: true, // Actualiza las tablas existentes con los cambios del modelo
        },
        // define: {
        //   timestamps: true,
        //   underscored: true,
        //   freezeTableName: true,
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'SEQUELIZE',
      useValue: sequelize,
    },
    DatabaseService,
  ],
  exports: ['SEQUELIZE', SequelizeModule, DatabaseService],
})
export class DatabaseModule {}
