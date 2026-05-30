import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Kudos } from './entities/kudos.entity';
import { Like } from './entities/like.entity';
import { Hashtag } from './entities/hashtag.entity';
import { KudosHashtag } from './entities/kudos-hashtag.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('DB_HOST', 'localhost'),
        port: cs.get<number>('DB_PORT', 5432),
        username: cs.get<string>('DB_USER', 'postgres'),
        password: cs.get<string>('DB_PASS', 'postgres'),
        database: cs.get<string>('DB_NAME', 'saa_kudos'),
        entities: [User, Kudos, Like, Hashtag, KudosHashtag],
        synchronize: false, // dev only — disable for prod migrations
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
