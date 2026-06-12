import { AppDataSource } from '../../config/typeorm.config';
import { seedProducts } from './product.seed';
import { seedUsers } from './user.seed';

async function runSeed() {
  console.log('🌱 Initializing data source...');
  await AppDataSource.initialize();

  try {
    await seedProducts(AppDataSource);
    await seedUsers(AppDataSource);
    console.log('✅ All seeds completed');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void runSeed();
