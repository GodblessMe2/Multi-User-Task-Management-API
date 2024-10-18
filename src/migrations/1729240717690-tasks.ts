import { MigrationInterface, QueryRunner } from "typeorm";

export class Tasks1729240717690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."tasks_status_enum" AS ENUM (
        'pending',
        'in_progress',
        'completed',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."tasks_tags_enum" AS ENUM (
        'urgent',
        'important',
        'low_priority',
        'bug',
        'feature'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "dueDate" TIMESTAMP,
        "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'pending',
        "tags" "public"."tasks_tags_enum"[] DEFAULT ARRAY['low_priority']::"public"."tasks_tags_enum"[],
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "createdById" uuid,
        "assignedToId" uuid,
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_createdById" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_assignedToId" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);

    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);

    await queryRunner.query(`DROP TYPE "public"."tasks_tags_enum"`);
  }
}
