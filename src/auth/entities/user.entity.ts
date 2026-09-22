import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column()
  userName!: string;

  @Column()
  role!: string;

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken!: string | null;

  @Column({ default: false })
  isOAuth: boolean;
}
