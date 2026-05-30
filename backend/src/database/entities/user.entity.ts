import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  picture: string;

  /** Department from JWT profile; may be empty string if not provided */
  @Column({ nullable: true, default: '' })
  department: string;

  /** Star count (hoa thị) accumulated over time */
  @Column({ default: 0 })
  stars: number;

  @CreateDateColumn()
  createdAt: Date;
}
