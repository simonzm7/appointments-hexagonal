import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const _configService = app.get(ConfigService);
  await app.listen(_configService.get('PORT'));
}
bootstrap();
