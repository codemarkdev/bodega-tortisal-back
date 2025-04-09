import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        configService.get<string>('FRONTEND_URL'),
        configService.get<string>('FRONTEND_URL_PROD'),
        configService.get<string>('BACKEND_URL'),
        configService.get<string>('BACKEND_URL_PROD'),
        configService.get<string>('BACKEND_URL_LOCAL'),
        configService.get<string>('FRONTEND_URL_LOCAL'),
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'))
      }
    },

    methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Bodega Tortisal Backend')
    .setDescription('Backend inventario')
    .setVersion('0.0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config);

  document.tags = [
    { name: 'Users', description: 'Endpoints Related to Users' },
    { name: 'Employees', description: 'Endpoints Related to Employees' },
    { name: 'Products', description: 'Endpoints Related to Products' },
    { name: 'Shifts', description: 'Endpoints Related to Shifts' },
    { name: 'Tools Issued', description: 'Endpoints Related to Tools Issued'}
  ];

  SwaggerModule.setup('api', app, document) 


  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
