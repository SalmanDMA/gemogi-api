import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  console.log('🔄 Bootstrapping application to generate Swagger...');
  const app = await NestFactory.create(AppModule, { logger: false });

  app.setGlobalPrefix('api', { exclude: ['health'] });

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

  const document = SwaggerModule.createDocument(app, config);

  const outputPath = path.join(process.cwd(), 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');

  console.log(`\n✅ Swagger JSON successfully generated at: ${outputPath}`);
  await app.close();
  process.exit(0);
}

generate().catch((err) => {
  console.error('❌ Failed to generate Swagger JSON:', err);
  process.exit(1);
});
