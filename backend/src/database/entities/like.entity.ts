import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Kudos } from './kudos.entity';
import { User } from './user.entity';

@Entity('like')
@Unique(['kudosId', 'userEmail'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  kudosId: string;

  @ManyToOne(() => Kudos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kudosId' })
  kudos: Kudos;

  @Column()
  userEmail: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userEmail' })
  user: User;
}
