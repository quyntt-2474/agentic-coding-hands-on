import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Kudos } from '../database/entities/kudos.entity';
import { Like } from '../database/entities/like.entity';
import { Hashtag } from '../database/entities/hashtag.entity';
import { KudosHashtag } from '../database/entities/kudos-hashtag.entity';
import { User } from '../database/entities/user.entity';
import { KudosCardDto, KudosUserDto } from './dto/kudos-card.dto';
import { KudosQueryDto } from './dto/kudos-query.dto';
import { CreateKudosDto } from './dto/create-kudos.dto';
import { S3Service } from '../s3/s3.service';

export interface JwtUser {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

/** Tier label shown on the spotlight hover card. Threshold tuned to match
 *  the "Legend Hero" badge that the Figma design hands out at 25 kudos. */
function deriveBadge(kudosReceived: number): string {
  if (kudosReceived >= 20) return 'Legend Hero';
  if (kudosReceived >= 10) return 'Super Hero';
  if (kudosReceived >= 5) return 'Rising Hero';
  if (kudosReceived >= 1) return 'New Hero';
  return '';
}

@Injectable()
export class KudosService {
  constructor(
    @InjectRepository(Kudos) private kudosRepo: Repository<Kudos>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Hashtag) private hashtagRepo: Repository<Hashtag>,
    @InjectRepository(KudosHashtag)
    private kudosHashtagRepo: Repository<KudosHashtag>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
    private s3: S3Service,
  ) {}

  // ── Helpers ────────────────────────────────────────────────────────────────

  private toUserDto(u: User): KudosUserDto {
    return {
      email: u.email,
      name: `${u.firstName} ${u.lastName}`.trim(),
      picture: u.picture ?? '',
      department: u.department ?? '',
      stars: u.stars,
    };
  }

  private async toCard(
    kudos: Kudos,
    hashtags: string[],
    likedByMe: boolean,
  ): Promise<KudosCardDto> {
    // Generate pre-signed URLs for any attached images
    const imageUrls = kudos.imageKeys?.length
      ? await Promise.all(
          kudos.imageKeys.map((key) => this.s3.getPresignedUrl(key)),
        )
      : [];

    // When anonymous, mask sender info with alias
    const senderDto = kudos.isAnonymous
      ? {
          ...this.toUserDto(kudos.sender),
          name: kudos.senderAlias ?? 'Ẩn danh',
          email: '',
          picture: '',
        }
      : this.toUserDto(kudos.sender);

    return {
      id: kudos.id,
      sender: senderDto,
      receiver: this.toUserDto(kudos.receiver),
      title: kudos.title ?? null,
      message: kudos.message,
      hashtags,
      likeCount: kudos.likeCount,
      likedByMe,
      isAnonymous: kudos.isAnonymous,
      senderAlias: kudos.senderAlias,
      imageUrls,
      createdAt: kudos.createdAt.toISOString(),
    };
  }

  private async fetchHashtags(
    kudosIds: string[],
  ): Promise<Map<string, string[]>> {
    if (!kudosIds.length) return new Map();
    const rows = await this.kudosHashtagRepo
      .createQueryBuilder('kh')
      .innerJoinAndSelect('kh.hashtag', 'h')
      .where('kh.kudosId IN (:...ids)', { ids: kudosIds })
      .getMany();
    const map = new Map<string, string[]>();
    for (const kh of rows) {
      const list = map.get(kh.kudosId) ?? [];
      list.push(kh.hashtag.name);
      map.set(kh.kudosId, list);
    }
    return map;
  }

  private async fetchLikedSet(
    kudosIds: string[],
    userEmail: string,
  ): Promise<Set<string>> {
    if (!kudosIds.length || !userEmail) return new Set();
    const likes = await this.likeRepo
      .createQueryBuilder('l')
      .where('l.kudosId IN (:...ids)', { ids: kudosIds })
      .andWhere('l.userEmail = :email', { email: userEmail })
      .getMany();
    return new Set(likes.map((l) => l.kudosId));
  }

  // ── Query methods ───────────────────────────────────────────────────────────

  async findAll(
    query: KudosQueryDto,
    userEmail?: string,
  ): Promise<{
    data: KudosCardDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));

    let qb = this.kudosRepo
      .createQueryBuilder('k')
      .innerJoinAndSelect('k.sender', 'sender')
      .innerJoinAndSelect('k.receiver', 'receiver')
      .orderBy('k.createdAt', 'DESC')
      // Unique tiebreaker: keeps OFFSET pagination deterministic when several
      // kudos share the same createdAt — otherwise Load More can repeat/skip rows.
      .addOrderBy('k.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.hashtag) {
      qb = qb
        .innerJoin('k.hashtags', 'kh_filter')
        .innerJoin('kh_filter.hashtag', 'ht_filter')
        .andWhere('ht_filter.name = :ht', { ht: query.hashtag });
    }

    if (query.department) {
      qb = qb.andWhere('receiver.department = :dept', {
        dept: query.department,
      });
    }

    const [kudosList, total] = await qb.getManyAndCount();
    const ids = kudosList.map((k) => k.id);
    const hashtagMap = await this.fetchHashtags(ids);
    const likedSet = userEmail
      ? await this.fetchLikedSet(ids, userEmail)
      : new Set<string>();

    const data = await Promise.all(
      kudosList.map((k) =>
        this.toCard(k, hashtagMap.get(k.id) ?? [], likedSet.has(k.id)),
      ),
    );

    return { data, total, page, limit };
  }

  async findOne(id: string, userEmail?: string): Promise<KudosCardDto> {
    const kudos = await this.kudosRepo
      .createQueryBuilder('k')
      .innerJoinAndSelect('k.sender', 'sender')
      .innerJoinAndSelect('k.receiver', 'receiver')
      .where('k.id = :id', { id })
      .getOne();

    if (!kudos) throw new NotFoundException(`Kudos ${id} not found`);

    const hashtagMap = await this.fetchHashtags([id]);
    const likedByMe = userEmail
      ? !!(await this.likeRepo.findOne({ where: { kudosId: id, userEmail } }))
      : false;

    return this.toCard(kudos, hashtagMap.get(id) ?? [], likedByMe);
  }

  async findHighlight(
    hashtag?: string,
    department?: string,
    userEmail?: string,
  ): Promise<KudosCardDto[]> {
    let qb = this.kudosRepo
      .createQueryBuilder('k')
      .innerJoinAndSelect('k.sender', 'sender')
      .innerJoinAndSelect('k.receiver', 'receiver')
      .orderBy('k.likeCount', 'DESC')
      .take(5);

    if (hashtag) {
      qb = qb
        .innerJoin('k.hashtags', 'kh_filter')
        .innerJoin('kh_filter.hashtag', 'ht_filter')
        .andWhere('ht_filter.name = :ht', { ht: hashtag });
    }

    if (department) {
      qb = qb.andWhere('receiver.department = :dept', { dept: department });
    }

    const kudosList = await qb.getMany();
    const ids = kudosList.map((k) => k.id);
    const hashtagMap = await this.fetchHashtags(ids);
    const likedSet = userEmail
      ? await this.fetchLikedSet(ids, userEmail)
      : new Set<string>();

    return Promise.all(
      kudosList.map((k) =>
        this.toCard(k, hashtagMap.get(k.id) ?? [], likedSet.has(k.id)),
      ),
    );
  }

  async findSpotlight(): Promise<
    { name: string; email: string; count: number }[]
  > {
    const rows: {
      email: string;
      firstName: string;
      lastName: string;
      count: string;
    }[] = await this.kudosRepo
      .createQueryBuilder('k')
      .select('u.email', 'email')
      .addSelect('u.firstName', 'firstName')
      .addSelect('u.lastName', 'lastName')
      .addSelect('COUNT(k.id)', 'count')
      .innerJoin('k.receiver', 'u')
      .groupBy('u.email')
      .addGroupBy('u.firstName')
      .addGroupBy('u.lastName')
      .orderBy('count', 'DESC')
      .getRawMany();

    return rows.map((r) => ({
      email: r.email,
      name: `${r.firstName} ${r.lastName}`.trim(),
      count: parseInt(r.count, 10),
    }));
  }

  async findSpotlightRecent(): Promise<
    { email: string; name: string; createdAt: string }[]
  > {
    const rows = await this.kudosRepo
      .createQueryBuilder('k')
      .innerJoin('k.receiver', 'u')
      .select('u.email', 'email')
      .addSelect('u.firstName', 'firstName')
      .addSelect('u.lastName', 'lastName')
      .addSelect('k.createdAt', 'createdAt')
      .orderBy('k.createdAt', 'DESC')
      .limit(7)
      .getRawMany<{
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
      }>();

    return rows.map((r) => ({
      email: r.email,
      name: `${r.firstName} ${r.lastName}`.trim(),
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : new Date(r.createdAt).toISOString(),
    }));
  }

  /** Compact profile shown when hovering a name in the spotlight word cloud. */
  async getRecipientProfile(email: string) {
    const [user, kudosReceived, kudosSent] = await Promise.all([
      this.userRepo.findOne({ where: { email } }),
      this.kudosRepo.count({ where: { receiverEmail: email } }),
      this.kudosRepo.count({ where: { senderEmail: email } }),
    ]);
    if (!user) throw new NotFoundException('User not found');
    return {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      picture: user.picture ?? '',
      department: user.department ?? '',
      kudosReceived,
      kudosSent,
      badge: deriveBadge(kudosReceived),
    };
  }

  async getStats(userEmail: string) {
    const [kudosReceived, kudosSent, heartsResult, recentRecipients] =
      await Promise.all([
        this.kudosRepo.count({ where: { receiverEmail: userEmail } }),
        this.kudosRepo.count({ where: { senderEmail: userEmail } }),
        this.likeRepo
          .createQueryBuilder('l')
          .innerJoin('l.kudos', 'k')
          .where('k.receiverEmail = :email', { email: userEmail })
          .getCount(),
        this.kudosRepo
          .createQueryBuilder('k')
          .innerJoinAndSelect('k.receiver', 'r')
          .orderBy('k.createdAt', 'DESC')
          .take(10)
          .getMany(),
      ]);

    return {
      kudosReceived,
      kudosSent,
      heartsReceived: heartsResult,
      recentRecipients: recentRecipients.map((k) => ({
        email: k.receiver.email,
        name: `${k.receiver.firstName} ${k.receiver.lastName}`.trim(),
        picture: k.receiver.picture ?? '',
      })),
    };
  }

  // ── Mutation methods ────────────────────────────────────────────────────────

  async create(dto: CreateKudosDto, user: JwtUser): Promise<KudosCardDto> {
    return this.dataSource.transaction(async (em) => {
      // Upsert sender
      await em.upsert(
        User,
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
        },
        ['email'],
      );

      // Ensure receiver exists (minimal record)
      const existing = await em.findOne(User, {
        where: { email: dto.receiverEmail },
      });
      if (!existing) {
        await em.save(User, {
          email: dto.receiverEmail,
          firstName: dto.receiverEmail.split('@')[0],
          lastName: '',
          department: '',
          stars: 0,
        });
      }

      // Validate S3 key ownership — each key must be scoped to this user
      if (dto.imageKeys?.length) {
        const prefix = `kudos-images/${user.email}/`;
        const invalid = dto.imageKeys.filter((k) => !k.startsWith(prefix));
        if (invalid.length) {
          throw new BadRequestException(
            'One or more image keys do not belong to the current user',
          );
        }
      }

      // Create kudos
      const kudos = await em.save(Kudos, {
        senderEmail: user.email,
        receiverEmail: dto.receiverEmail,
        title: dto.title?.trim() ? dto.title.trim() : null,
        message: dto.message,
        likeCount: 0,
        isAnonymous: dto.isAnonymous ?? false,
        senderAlias: dto.isAnonymous ? (dto.senderAlias ?? null) : null,
        imageKeys: dto.imageKeys?.length ? dto.imageKeys : null,
      });

      // Upsert hashtags (atomic — avoids race condition on concurrent submissions)
      for (const name of dto.hashtags) {
        await em.upsert(Hashtag, { name }, ['name']);
        const tag = await em.findOneOrFail(Hashtag, { where: { name } });
        await em.upsert(
          KudosHashtag,
          { kudosId: kudos.id, hashtagId: tag.id },
          ['kudosId', 'hashtagId'],
        );
      }

      // Reload with relations
      const full = await em.findOne(Kudos, {
        where: { id: kudos.id },
        relations: { sender: true, receiver: true },
      });

      if (!full) throw new NotFoundException('Created kudos not found');
      return this.toCard(full, dto.hashtags, false);
    });
  }

  async like(kudosId: string, userEmail: string): Promise<void> {
    const kudos = await this.kudosRepo.findOne({ where: { id: kudosId } });
    if (!kudos) throw new NotFoundException(`Kudos ${kudosId} not found`);

    const existing = await this.likeRepo.findOne({
      where: { kudosId, userEmail },
    });
    if (existing) throw new ConflictException('Already liked');

    await this.dataSource.transaction(async (em) => {
      await em.save(Like, { kudosId, userEmail });
      await em.increment(Kudos, { id: kudosId }, 'likeCount', 1);
    });
  }

  async unlike(kudosId: string, userEmail: string): Promise<void> {
    const kudos = await this.kudosRepo.findOne({ where: { id: kudosId } });
    if (!kudos) throw new NotFoundException(`Kudos ${kudosId} not found`);

    const existing = await this.likeRepo.findOne({
      where: { kudosId, userEmail },
    });
    if (!existing) throw new NotFoundException('Not liked');

    await this.dataSource.transaction(async (em) => {
      await em.delete(Like, { kudosId, userEmail });
      await em.decrement(Kudos, { id: kudosId }, 'likeCount', 1);
    });
  }
}
