import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from '../database/entities/hashtag.entity';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag])],
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}
