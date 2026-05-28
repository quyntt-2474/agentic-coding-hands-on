import { MigrationInterface, QueryRunner } from 'typeorm';

/** Adds the "Danh hiệu" (title) column to the kudos table. */
export class AddKudosTitle1779800000000 implements MigrationInterface {
  name = 'AddKudosTitle1779800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "kudos" ADD "title" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "title"`);
  }
}
