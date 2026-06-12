import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.enum';
import * as bcrypt from 'bcrypt';

const USER_SEEDS = [
  {
    name: 'Admin Gemogi',
    email: 'admin@gemogi.com',
    password: 'Password123',
    role: Role.ADMIN,
  },
  {
    name: 'User Gemogi',
    email: 'user@gemogi.com',
    password: 'Password123',
    role: Role.USER,
  },
];

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);

  let seededCount = 0;
  for (const seed of USER_SEEDS) {
    const existing = await userRepo.findOne({
      where: { email: seed.email },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(seed.password, 10);
      const user = userRepo.create({
        ...seed,
        password: hashedPassword,
      });
      await userRepo.save(user);
      seededCount++;
    }
  }

  if (seededCount > 0) {
    console.log(`✅ Seeded ${seededCount} new users`);
  } else {
    console.log('Users already fully seeded. Skipping.');
  }
}
