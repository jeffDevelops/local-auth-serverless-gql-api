import { MigrationInterface, QueryRunner } from "typeorm";

export class pgcryptoExtension1587957445842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP EXTENSION IF EXISTS pgcrypto");
  }
}
