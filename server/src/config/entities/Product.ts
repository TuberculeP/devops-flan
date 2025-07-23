import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @Column()
  title: string;

  @Column()
  image: string;
  
  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}