import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
