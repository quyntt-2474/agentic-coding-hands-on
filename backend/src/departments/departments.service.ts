import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

const CANONICAL_DEPARTMENTS: readonly string[] = [
  'CTO',
  'SPD',
  'FCOV',
  'CEVC1',
  'CEVC2',
  'STVC - R&D',
  'CEVC2 - CySS',
  'FCOV - LRM',
  'CEVC2 - System',
  'OPDC - HRF',
  'CEVC1 - DSV - UI/UX 1',
  'CEVC1 - DSV',
  'CEVEC',
  'OPDC - HRD - C&C',
  'STVC',
  'FCOV - F&A',
  'CEVC1 - DSV - UI/UX 2',
  'CEVC1 - AIE',
  'OPDC - HRF - C&B',
  'FCOV - GA',
  'FCOV - ISO',
  'STVC - EE',
  'GEU - HUST',
  'CEVEC - SAPD',
  'OPDC - HRF - OD',
  'CEVEC - GSD',
  'GEU - TM',
  'STVC - R&D - DTR',
  'STVC - R&D - DPS',
  'CEVC3',
  'STVC - R&D - AIR',
  'CEVC4',
  'PAO',
  'GEU',
  'GEU - DUT',
  'OPDC - HRD - L&D',
  'OPDC - HRD - TI',
  'OPDC - HRF - TA',
  'GEU - UET',
  'STVC - R&D - SDX',
  'OPDC - HRD - HRBP',
  'PAO - PEC',
  'IAV',
  'STVC - Infra',
  'CPV - CGP',
  'GEU - UIT',
  'OPDC - HRD',
  'BDV',
  'CPV',
  'PAO - PAO',
];

@Injectable()
export class DepartmentsService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<string[]> {
    const rows: { department: string }[] = await this.userRepo
      .createQueryBuilder('u')
      .select('DISTINCT u.department', 'department')
      .where('u.department IS NOT NULL')
      .andWhere("u.department != ''")
      .getRawMany();
    const fromDb = rows.map((r) => r.department);
    const merged = Array.from(new Set([...CANONICAL_DEPARTMENTS, ...fromDb]));
    merged.sort((a, b) => a.localeCompare(b));
    return merged;
  }
}
