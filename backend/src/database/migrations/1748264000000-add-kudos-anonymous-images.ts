import { MigrationInterface, QueryRunner } from 'typeorm';

/** Adds anonymous-send and image-upload support to the kudos table. */
export class AddKudosAnonymousImages1748264000000 implements MigrationInterface {
  name = 'AddKudosAnonymousImages1748264000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kudos" ADD "isAnonymous" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos" ADD "senderAlias" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos" ADD "imageKeys" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "imageKeys"`);
    await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "senderAlias"`);
    await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "isAnonymous"`);
  }
}
