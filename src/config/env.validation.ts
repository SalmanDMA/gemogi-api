import { IsString, IsDefined } from 'class-validator';

export class EnvValidation {
  @IsDefined()
  @IsString()
  DB_HOST: string;

  @IsDefined()
  @IsString()
  DB_PORT: string;

  @IsDefined()
  @IsString()
  DB_USERNAME: string;

  @IsDefined()
  @IsString()
  DB_PASSWORD: string;

  @IsDefined()
  @IsString()
  DB_DATABASE: string;

  @IsDefined()
  @IsString()
  REDIS_HOST: string;

  @IsDefined()
  @IsString()
  REDIS_PORT: string;

  @IsDefined()
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsDefined()
  @IsString()
  JWT_ACCESS_EXPIRES_IN: string;

  @IsDefined()
  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsDefined()
  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsDefined()
  @IsString()
  CALLBACK_URL: string;
}

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvValidation, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }
  return validated;
}
