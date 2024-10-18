import { MigrationInterface, QueryRunner } from "typeorm";

export class Comments1729240733080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the comments table
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "message" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "taskId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_comment_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_comment" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_comment" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comment_task" ON "comments" ("taskId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comment_user" ON "comments" ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_comment_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_comment_task"`);

    await queryRunner.query(`DROP TABLE "comments"`);
  }
}
