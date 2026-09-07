import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  userName!: string;

  @Column()
  role!: string;

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken!: string | null;
}