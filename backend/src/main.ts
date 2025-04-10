import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DatabaseService } from './modules/shared/database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  // Cors
  app.enableCors({
    origin: true, // <- permite cualquier origen
    credentials: true, // si usas cookies, tokens, etc.
  });

  // SwaggerModule

  // Crear la configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Libros')
    .setDescription('Documentación para la API de gestión de libros')
    .setVersion('1.0')
    .addBearerAuth(
      // Añadimos autenticación Bearer
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Especificamos que usamos JWT
      },
      'access-token', // Nombre del esquema de seguridad
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' es la ruta donde estará disponible Swagger UI

  // Inicializa la base de datos y seeders
  const databaseService = app.get(DatabaseService);
  await databaseService.onModuleInit();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
