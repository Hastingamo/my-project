import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: ['http://localhost:3000', 'https://cardealership-wine.vercel.app/'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
