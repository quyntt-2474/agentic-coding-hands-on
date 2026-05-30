import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

export interface UserSearchResult {
  email: string;
  name: string;
  picture: string;
  department: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /**
   * Search users by name or email (case-insensitive).
   * An empty query returns all users (up to `limit`).
   */
  async search(q: string, limit = 10): Promise<UserSearchResult[]> {
    const term = q?.trim() ?? '';

    const qb = this.repo
      .createQueryBuilder('u')
      .orderBy('u.firstName', 'ASC')
      .take(limit);

    if (term) {
      qb.where(
        `CONCAT(u."firstName", ' ', u."lastName") ILIKE :term OR u.email ILIKE :term`,
        { term: `%${term}%` },
      );
    }

    const users = await qb.getMany();

    return users.map((u) => ({
      email: u.email,
      name: `${u.firstName} ${u.lastName}`.trim(),
      picture: u.picture ?? '',
      department: u.department ?? '',
    }));
  }
}
