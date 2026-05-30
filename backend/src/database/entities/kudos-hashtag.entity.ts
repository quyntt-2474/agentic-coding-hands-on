import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Kudos } from './kudos.entity';
import { Hashtag } from './hashtag.entity';

@Entity('kudos_hashtag')
export class KudosHashtag {
  @PrimaryColumn()
  kudosId: string;

  @PrimaryColumn()
  hashtagId: number;

  @ManyToOne(() => Kudos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kudosId' })
  kudos: Kudos;

  @ManyToOne(() => Hashtag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hashtagId' })
  hashtag: Hashtag;
}
