import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { KudosHashtag } from './kudos-hashtag.entity';

@Entity('kudos')
export class Kudos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderEmail: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'senderEmail' })
  sender: User;

  @Column()
  receiverEmail: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'receiverEmail' })
  receiver: User;

  /** Danh hiệu — short title/badge the sender gives this kudos */
  @Column({ nullable: true, type: 'varchar' })
  title: string | null;

  @Column('text')
  message: string;

  /** Cached counter kept in sync with the Like table */
  @Column({ default: 0 })
  likeCount: number;

  /** If true, sender is displayed anonymously using senderAlias */
  @Column({ default: false })
  isAnonymous: boolean;

  /** Display name used when isAnonymous is true */
  @Column({ nullable: true, type: 'varchar' })
  senderAlias: string | null;

  /** S3 object keys for attached images (up to 5) */
  @Column('simple-array', { nullable: true })
  imageKeys: string[] | null;

  @OneToMany(() => KudosHashtag, (kh) => kh.kudos)
  hashtags: KudosHashtag[];

  @CreateDateColumn()
  createdAt: Date;
}
