import { MigrationInterface, QueryRunner } from 'typeorm';

/** Seeds 10 default users spread across distinct departments. Idempotent via ON CONFLICT. */
export class SeedDefaultUsers1780000000000 implements MigrationInterface {
  name = 'SeedDefaultUsers1780000000000';

  private readonly users: ReadonlyArray<{
    email: string;
    firstName: string;
    lastName: string;
    department: string;
  }> = [
    {
      email: 'an.nguyen@sun-asterisk.com',
      firstName: 'An',
      lastName: 'Nguyen',
      department: 'CTO',
    },
    {
      email: 'binh.tran@sun-asterisk.com',
      firstName: 'Binh',
      lastName: 'Tran',
      department: 'SPD',
    },
    {
      email: 'chi.le@sun-asterisk.com',
      firstName: 'Chi',
      lastName: 'Le',
      department: 'FCOV',
    },
    {
      email: 'dung.pham@sun-asterisk.com',
      firstName: 'Dung',
      lastName: 'Pham',
      department: 'CEVC1',
    },
    {
      email: 'em.hoang@sun-asterisk.com',
      firstName: 'Em',
      lastName: 'Hoang',
      department: 'CEVC2',
    },
    {
      email: 'phong.vu@sun-asterisk.com',
      firstName: 'Phong',
      lastName: 'Vu',
      department: 'STVC - R&D',
    },
    {
      email: 'giang.do@sun-asterisk.com',
      firstName: 'Giang',
      lastName: 'Do',
      department: 'OPDC - HRF',
    },
    {
      email: 'huy.bui@sun-asterisk.com',
      firstName: 'Huy',
      lastName: 'Bui',
      department: 'CEVEC',
    },
    {
      email: 'khanh.dang@sun-asterisk.com',
      firstName: 'Khanh',
      lastName: 'Dang',
      department: 'PAO',
    },
    {
      email: 'linh.ngo@sun-asterisk.com',
      firstName: 'Linh',
      lastName: 'Ngo',
      department: 'BDV',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const u of this.users) {
      await queryRunner.query(
        `INSERT INTO "user" ("email", "firstName", "lastName", "department") VALUES ($1, $2, $3, $4) ON CONFLICT ("email") DO NOTHING`,
        [u.email, u.firstName, u.lastName, u.department],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const emails = this.users.map((u) => u.email);
    await queryRunner.query(`DELETE FROM "user" WHERE "email" = ANY($1)`, [
      emails,
    ]);
  }
}
