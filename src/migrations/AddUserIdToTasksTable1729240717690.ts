import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToTasksTable1729240717690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD "userId" uuid;
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD CONSTRAINT "FK_user_tasks" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks" DROP CONSTRAINT "FK_user_tasks";
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks" DROP COLUMN "userId";
    `);
  }
}
