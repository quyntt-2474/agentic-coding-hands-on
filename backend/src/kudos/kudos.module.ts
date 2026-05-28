import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kudos } from '../database/entities/kudos.entity';
import { Like } from '../database/entities/like.entity';
import { Hashtag } from '../database/entities/hashtag.entity';
import { KudosHashtag } from '../database/entities/kudos-hashtag.entity';
import { User } from '../database/entities/user.entity';
import { S3Module } from '../s3/s3.module';
import { KudosController } from './kudos.controller';
import { KudosService } from './kudos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kudos, Like, Hashtag, KudosHashtag, User]),
    S3Module,
  ],
  controllers: [KudosController],
  providers: [KudosService],
  exports: [KudosService],
})
export class KudosModule {}
