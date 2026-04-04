import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // required for Expo Web to fetch from localhost:3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
