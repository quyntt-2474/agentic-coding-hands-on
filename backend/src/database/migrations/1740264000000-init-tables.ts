import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1779708539571 implements MigrationInterface {
  name = 'InitTables1779708539571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "picture" character varying, "department" character varying DEFAULT '', "stars" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12875dfb3b1d92d7d7c5377e22" PRIMARY KEY ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hashtag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_347fec870eafea7b26c8a73bac1" UNIQUE ("name"), CONSTRAINT "PK_cb36eb8af8412bfa978f1165d78" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "kudos_hashtag" ("kudosId" uuid NOT NULL, "hashtagId" integer NOT NULL, CONSTRAINT "PK_54bbc6ddd1fbe60787beba6d912" PRIMARY KEY ("kudosId", "hashtagId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "kudos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderEmail" character varying NOT NULL, "receiverEmail" character varying NOT NULL, "message" text NOT NULL, "likeCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed7aa56ecf082848c38a3cde5d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "kudosId" uuid NOT NULL, "userEmail" character varying NOT NULL, CONSTRAINT "UQ_cf9f31d9dba7ce19a4f4aa56dfa" UNIQUE ("kudosId", "userEmail"), CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos_hashtag" ADD CONSTRAINT "FK_f93ec796288ddf01b46698bd13a" FOREIGN KEY ("kudosId") REFERENCES "kudos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos_hashtag" ADD CONSTRAINT "FK_a7c3e4ebd7959cddda513277b2e" FOREIGN KEY ("hashtagId") REFERENCES "hashtag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos" ADD CONSTRAINT "FK_073025a494e8e26250081af6274" FOREIGN KEY ("senderEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos" ADD CONSTRAINT "FK_9f8129dcc1ee1bde466ec5ad66a" FOREIGN KEY ("receiverEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" ADD CONSTRAINT "FK_ac5f95a8061ea8fe5e93de56eb9" FOREIGN KEY ("kudosId") REFERENCES "kudos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" ADD CONSTRAINT "FK_ecd0c04e1a635b13e2baf17fe5d" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "like" DROP CONSTRAINT "FK_ecd0c04e1a635b13e2baf17fe5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" DROP CONSTRAINT "FK_ac5f95a8061ea8fe5e93de56eb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos" DROP CONSTRAINT "FK_9f8129dcc1ee1bde466ec5ad66a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos" DROP CONSTRAINT "FK_073025a494e8e26250081af6274"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos_hashtag" DROP CONSTRAINT "FK_a7c3e4ebd7959cddda513277b2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kudos_hashtag" DROP CONSTRAINT "FK_f93ec796288ddf01b46698bd13a"`,
    );
    await queryRunner.query(`DROP TABLE "like"`);
    await queryRunner.query(`DROP TABLE "kudos"`);
    await queryRunner.query(`DROP TABLE "kudos_hashtag"`);
    await queryRunner.query(`DROP TABLE "hashtag"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
