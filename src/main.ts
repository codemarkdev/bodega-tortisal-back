import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'localhost:4000'),
    methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    allowHeaders: 'Content-Type, Authorization',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Bodega Tortisal Backend')
    .setDescription('Backend inventario')
    .setVersion('0.0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config);

  document.tags = [
    {name: 'users', description: 'Endpoints Related to Users'}
  ];

  SwaggerModule.setup('api', app, document) 


  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
