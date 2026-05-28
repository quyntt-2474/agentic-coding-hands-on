import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from '../database/entities/hashtag.entity';

@Injectable()
export class HashtagsService {
  constructor(@InjectRepository(Hashtag) private repo: Repository<Hashtag>) {}

  findAll(): Promise<Hashtag[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }
}
