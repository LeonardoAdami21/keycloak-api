import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  const config = new DocumentBuilder()
    .setTitle('Keycloak API')
    .setDescription(
      'Keycloak API for authentication and authorization management',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v1/docs', app, document);

  const port = process.env.APP_PORT || 3000;
  const host = process.env.APP_HOST || '0.0.0.0';
  await app.listen(port, host, () => {
    console.log(`Server running on port ${port}/v1`);
    console.log(`Swagger running on http://localhost:${port}/v1/docs`);
  });
}
bootstrap();
