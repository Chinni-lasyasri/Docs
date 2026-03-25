import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: [
    //   'https://docs-ui-azure.vercel.app',
    //   'https://docs-8x8sfcp8m-chinni-lasyasris-projects.vercel.app',
    // ],
    origin: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
