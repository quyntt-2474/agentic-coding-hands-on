/**
 * Standalone DataSource for TypeORM CLI (migration:generate / run / revert).
 * NOT used by the NestJS DI container — that lives in database.module.ts.
 *
 * Usage:
 *   npm run migration:generate -- <name>
 *   npm run migration:run
 *   npm run migration:revert
 *   npm run migration:show
 *
 * Env vars are read from the .env file in the backend root (same as runtime).
 * Load them before running: `source .env` or prefix the command with env vars.
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Kudos } from './entities/kudos.entity';
import { Like } from './entities/like.entity';
import { Hashtag } from './entities/hashtag.entity';
import { KudosHashtag } from './entities/kudos-hashtag.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'saa_kudos',
  entities: [User, Kudos, Like, Hashtag, KudosHashtag],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false,
});
