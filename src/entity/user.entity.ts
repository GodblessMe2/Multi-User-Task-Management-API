import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Task } from "./task.entity";
import { Comment } from "./comment.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true }) // Added unique constraint to email
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ default: "user" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];
}
