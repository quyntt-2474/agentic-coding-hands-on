import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class DepartmentsService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<string[]> {
    const rows: { department: string }[] = await this.userRepo
      .createQueryBuilder('u')
      .select('DISTINCT u.department', 'department')
      .where('u.department IS NOT NULL')
      .andWhere("u.department != ''")
      .orderBy('u.department', 'ASC')
      .getRawMany();
    return rows.map((r) => r.department);
  }
}
