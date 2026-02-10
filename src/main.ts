import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App running on port ${port}`);
}
bootstrap();
