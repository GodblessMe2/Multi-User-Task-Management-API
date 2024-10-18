import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: false })
  message: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: "CASCADE" })
  task: Task;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "SET NULL" })
  user: User;
}
