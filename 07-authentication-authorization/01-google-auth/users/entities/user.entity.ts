import { Column, Entity, PrimaryColumn } from "typeorm";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  displayName: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  accessToken: string;
}
