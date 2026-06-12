import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('--- DATABASE CONNECTION DEBUG ---');
  console.log(
    `DATABASE_URL_DETECTED: ${!!(process.env.DATABASE_URL ?? process.env.MYSQL_URL ?? process.env.MYSQL_PUBLIC_URL)}`,
  );
  console.log(
    `DB_HOST: ${JSON.stringify(process.env.DB_HOST ?? process.env.MYSQLHOST ?? 'localhost')}`,
  );
  console.log(
    `DB_PORT: ${JSON.stringify(process.env.DB_PORT ?? process.env.MYSQLPORT ?? '3306')}`,
  );
  console.log(
    `DB_USERNAME: ${JSON.stringify(process.env.DB_USERNAME ?? process.env.MYSQLUSER ?? 'gemogi')}`,
  );
  console.log(
    `DB_DATABASE: ${JSON.stringify(process.env.DB_DATABASE ?? process.env.MYSQLDATABASE ?? 'gemogi_db')}`,
  );
  console.log(
    `DB_PASSWORD_LEN: ${(process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD ?? '').length}`,
  );
  console.log('---------------------------------');

  console.log('--- REDIS CONNECTION DEBUG ---');
  console.log(
    `REDIS_URL_DETECTED: ${!!(process.env.REDIS_URL ?? process.env.REDIS_PUBLIC_URL)}`,
  );
  console.log(
    `REDIS_HOST: ${JSON.stringify(process.env.REDIS_HOST ?? process.env.REDISHOST ?? 'localhost')}`,
  );
  console.log(
    `REDIS_PORT: ${JSON.stringify(process.env.REDIS_PORT ?? process.env.REDISPORT ?? '6379')}`,
  );
  console.log(
    `REDIS_PASSWORD_LEN: ${(process.env.REDIS_PASSWORD ?? process.env.REDISPASSWORD ?? '').length}`,
  );
  console.log('------------------------------');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Gemogi Blueprint Commerce API')
    .setDescription('Digital Voucher & Top-Up Marketplace API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product catalog')
    .addTag('orders', 'Order management')
    .addTag('webhook', 'Webhook callbacks')
    .addTag('health', 'Health checks')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
}

void bootstrap();
