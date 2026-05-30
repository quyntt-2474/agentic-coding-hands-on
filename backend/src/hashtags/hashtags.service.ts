import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from '../database/entities/hashtag.entity';

const CANONICAL_HASHTAGS: readonly string[] = [
  'Toàn diện',
  'Giỏi chuyên môn',
  'Hiệu suất cao',
  'Truyền cảm hứng',
  'Cống hiến',
  'Aim High',
  'Be Agile',
  'Wasshoi',
  'Hướng mục tiêu',
  'Hướng khách hàng',
  'Chuẩn quy trình',
  'Giải pháp sáng tạo',
  'Quản lý xuất sắc',
];

@Injectable()
export class HashtagsService {
  constructor(@InjectRepository(Hashtag) private repo: Repository<Hashtag>) {}

  async findAll(): Promise<Hashtag[]> {
    const fromDb = await this.repo.find();
    const byName = new Map<string, Hashtag>();
    for (const tag of fromDb) byName.set(tag.name, tag);
    CANONICAL_HASHTAGS.forEach((name, idx) => {
      if (!byName.has(name)) {
        byName.set(name, { id: -(idx + 1), name } as Hashtag);
      }
    });
    return Array.from(byName.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }
}
