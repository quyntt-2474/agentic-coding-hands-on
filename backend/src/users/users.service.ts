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
   * Create the user on first login, or refresh their profile on subsequent
   * logins. Accumulated state (`stars`, `department`) is preserved.
   */
  async upsertFromGoogle(profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }): Promise<User> {
    const existing = await this.repo.findOne({
      where: { email: profile.email },
    });

    if (existing) {
      existing.firstName = profile.firstName;
      existing.lastName = profile.lastName;
      existing.picture = profile.picture;
      return this.repo.save(existing);
    }

    const user = this.repo.create({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      picture: profile.picture,
    });
    return this.repo.save(user);
  }

  /**
   * Search users by name or email (case-insensitive).
   * An empty query returns all users.
   */
  async search(q: string): Promise<UserSearchResult[]> {
    const term = q?.trim() ?? '';

    const qb = this.repo.createQueryBuilder('u').orderBy('u.firstName', 'ASC');

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
