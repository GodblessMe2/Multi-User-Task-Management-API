import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { User } from "./user.entity";
import { Comment } from "./comment.entity";
export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskTag {
  URGENT = "urgent",
  IMPORTANT = "important",
  LOW_PRIORITY = "low_priority",
  BUG = "bug",
  FEATURE = "feature",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "timestamp" })
  dueDate: Date;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: "enum",
    enum: TaskTag,
    array: true,
    default: [TaskTag.LOW_PRIORITY],
  })
  tags: TaskTag[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @ManyToOne(() => User, { eager: true })
  assignedTo: User;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
