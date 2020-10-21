import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, }));
  app.enableCors({ origin: [/localhost:9000/, /market-data-frontend.vercel.app/] });

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}

bootstrap();
