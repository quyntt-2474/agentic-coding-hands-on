import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { KudosService, JwtUser } from './kudos.service';
import { Kudos } from '../database/entities/kudos.entity';
import { Like } from '../database/entities/like.entity';
import { Hashtag } from '../database/entities/hashtag.entity';
import { User } from '../database/entities/user.entity';
import { CreateKudosDto } from './dto/create-kudos.dto';

/** Chainable query-builder mock — chain methods return `this`, terminals resolve configured values. */
function makeQb(terminals: Record<string, unknown> = {}) {
  const qb: Record<string, jest.Mock> = {};
  const chain = [
    'select',
    'addSelect',
    'innerJoin',
    'innerJoinAndSelect',
    'leftJoin',
    'where',
    'andWhere',
    'orderBy',
    'addOrderBy',
    'groupBy',
    'addGroupBy',
    'skip',
    'take',
    'limit',
  ];
  for (const m of chain) qb[m] = jest.fn(() => qb);
  qb.getMany = jest.fn().mockResolvedValue(terminals.getMany ?? []);
  qb.getManyAndCount = jest
    .fn()
    .mockResolvedValue(terminals.getManyAndCount ?? [[], 0]);
  qb.getOne = jest.fn().mockResolvedValue(terminals.getOne ?? null);
  qb.getRawMany = jest.fn().mockResolvedValue(terminals.getRawMany ?? []);
  qb.getCount = jest.fn().mockResolvedValue(terminals.getCount ?? 0);
  return qb;
}

function repoMock() {
  return {
    createQueryBuilder: jest.fn(() => makeQb()),
    findOne: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
  };
}

const sender: User = {
  email: 'alice@x.com',
  firstName: 'Alice',
  lastName: 'Anders',
  picture: 'pic-a',
  department: 'CTO',
  stars: 3,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

const receiver: User = {
  email: 'bob@x.com',
  firstName: 'Bob',
  lastName: 'Brown',
  picture: null as unknown as string,
  department: null as unknown as string,
  stars: 0,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function makeKudos(overrides: Partial<Kudos> = {}): Kudos {
  return {
    id: 'k1',
    senderEmail: sender.email,
    sender,
    receiverEmail: receiver.email,
    receiver,
    title: 'Great job',
    message: 'msg',
    likeCount: 2,
    isAnonymous: false,
    senderAlias: null,
    imageKeys: null,
    hashtags: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  } as Kudos;
}

describe('KudosService', () => {
  let service: KudosService;
  let kudosRepo: ReturnType<typeof repoMock>;
  let likeRepo: ReturnType<typeof repoMock>;
  let hashtagRepo: ReturnType<typeof repoMock>;
  let kudosHashtagRepo: ReturnType<typeof repoMock>;
  let userRepo: ReturnType<typeof repoMock>;
  let dataSource: { transaction: jest.Mock };
  let s3: { getPresignedUrl: jest.Mock; upload: jest.Mock };

  beforeEach(() => {
    kudosRepo = repoMock();
    likeRepo = repoMock();
    hashtagRepo = repoMock();
    kudosHashtagRepo = repoMock();
    userRepo = repoMock();
    dataSource = { transaction: jest.fn() };
    s3 = {
      getPresignedUrl: jest.fn().mockResolvedValue('https://signed.url/img'),
      upload: jest.fn(),
    };
    service = new KudosService(
      kudosRepo as never,
      likeRepo as never,
      hashtagRepo as never,
      kudosHashtagRepo as never,
      userRepo as never,
      dataSource as never,
      s3 as never,
    );
  });

  describe('findAll', () => {
    it('returns paginated cards with defaults and resolves images + hashtags + likes', async () => {
      const anon = makeKudos({
        id: 'k2',
        isAnonymous: true,
        senderAlias: 'Mystery',
        imageKeys: ['kudos-images/alice@x.com/a.png'],
      });
      const anonNoAlias = makeKudos({
        id: 'k3',
        isAnonymous: true,
        senderAlias: null,
      });
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getManyAndCount: [[makeKudos(), anon, anonNoAlias], 3] }),
      );
      kudosHashtagRepo.createQueryBuilder.mockReturnValue(
        makeQb({
          getMany: [{ kudosId: 'k1', hashtag: { name: 'Aim High' } }],
        }),
      );
      likeRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getMany: [{ kudosId: 'k1' }] }),
      );

      const res = await service.findAll({}, 'me@x.com');

      expect(res.total).toBe(3);
      expect(res.page).toBe(1);
      expect(res.limit).toBe(20);
      expect(res.data[0].hashtags).toEqual(['Aim High']);
      expect(res.data[0].likedByMe).toBe(true);
      // anonymous card masks the sender
      expect(res.data[1].sender.name).toBe('Mystery');
      expect(res.data[1].sender.email).toBe('');
      expect(res.data[1].imageUrls).toEqual(['https://signed.url/img']);
      // anonymous without alias falls back to default label
      expect(res.data[2].sender.name).toBe('Ẩn danh');
    });

    it('clamps pagination and applies hashtag + department filters', async () => {
      const qb = makeQb({ getManyAndCount: [[], 0] });
      kudosRepo.createQueryBuilder.mockReturnValue(qb);

      const res = await service.findAll({
        hashtag: 'Aim High',
        department: 'CTO',
        page: 0,
        limit: 100,
      });

      expect(res.page).toBe(1); // max(1, 0 || 1)
      expect(res.limit).toBe(50); // min(50, 100)
      expect(qb.innerJoin).toHaveBeenCalled();
      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('skips liked lookup when no user email', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getManyAndCount: [[makeKudos()], 1] }),
      );
      const res = await service.findAll({});
      expect(res.data[0].likedByMe).toBe(false);
      expect(likeRepo.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns card with likedByMe true when liked', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getOne: makeKudos() }),
      );
      likeRepo.findOne.mockResolvedValue({ kudosId: 'k1' });
      const res = await service.findOne('k1', 'me@x.com');
      expect(res.id).toBe('k1');
      expect(res.likedByMe).toBe(true);
    });

    it('returns likedByMe false when no user email', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getOne: makeKudos() }),
      );
      const res = await service.findOne('k1');
      expect(res.likedByMe).toBe(false);
    });

    it('throws NotFound when kudos missing', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(makeQb({ getOne: null }));
      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findHighlight', () => {
    it('applies filters and returns cards', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getMany: [makeKudos()] }),
      );
      likeRepo.createQueryBuilder.mockReturnValue(makeQb({ getMany: [] }));
      const res = await service.findHighlight('Aim High', 'CTO', 'me@x.com');
      expect(res).toHaveLength(1);
    });

    it('works without filters or user email', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(makeQb({ getMany: [] }));
      const res = await service.findHighlight();
      expect(res).toEqual([]);
    });
  });

  describe('findSpotlight', () => {
    it('maps raw rows and parses counts', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({
          getRawMany: [
            { email: 'b@x.com', firstName: 'Bob', lastName: 'Brown', count: '7' },
          ],
        }),
      );
      const res = await service.findSpotlight();
      expect(res).toEqual([{ email: 'b@x.com', name: 'Bob Brown', count: 7 }]);
    });
  });

  describe('findSpotlightRecent', () => {
    it('handles both Date and string createdAt', async () => {
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({
          getRawMany: [
            {
              email: 'b@x.com',
              firstName: 'Bob',
              lastName: 'Brown',
              createdAt: new Date('2026-01-02T00:00:00.000Z'),
            },
            {
              email: 'c@x.com',
              firstName: 'Cara',
              lastName: 'Cole',
              createdAt: '2026-01-03T00:00:00.000Z',
            },
          ],
        }),
      );
      const res = await service.findSpotlightRecent();
      expect(res[0].createdAt).toBe('2026-01-02T00:00:00.000Z');
      expect(res[1].createdAt).toBe('2026-01-03T00:00:00.000Z');
    });
  });

  describe('getRecipientProfile', () => {
    it.each([
      [25, 'Legend Hero'],
      [12, 'Super Hero'],
      [6, 'Rising Hero'],
      [1, 'New Hero'],
      [0, ''],
    ])('derives badge for %i kudos received', async (count, badge) => {
      userRepo.findOne.mockResolvedValue(receiver);
      kudosRepo.count.mockResolvedValueOnce(count).mockResolvedValueOnce(4);
      const res = await service.getRecipientProfile('bob@x.com');
      expect(res.badge).toBe(badge);
      expect(res.kudosReceived).toBe(count);
      expect(res.kudosSent).toBe(4);
      expect(res.name).toBe('Bob Brown');
    });

    it('throws NotFound when user missing', async () => {
      userRepo.findOne.mockResolvedValue(null);
      kudosRepo.count.mockResolvedValue(0);
      await expect(service.getRecipientProfile('x@x.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('aggregates counts and recent recipients', async () => {
      kudosRepo.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);
      likeRepo.createQueryBuilder.mockReturnValue(makeQb({ getCount: 9 }));
      kudosRepo.createQueryBuilder.mockReturnValue(
        makeQb({ getMany: [makeKudos()] }),
      );
      const res = await service.getStats('me@x.com');
      expect(res.kudosReceived).toBe(5);
      expect(res.kudosSent).toBe(2);
      expect(res.heartsReceived).toBe(9);
      expect(res.recentRecipients[0].name).toBe('Bob Brown');
    });
  });

  describe('create', () => {
    const dtoBase: CreateKudosDto = {
      receiverEmail: 'bob@x.com',
      message: 'thanks',
      hashtags: ['Aim High'],
    };
    const jwtUser: JwtUser = {
      sub: 'alice@x.com',
      email: 'alice@x.com',
      firstName: 'Alice',
      lastName: 'Anders',
      picture: 'pic-a',
    };

    function makeEm(fullKudos: Kudos | null) {
      return {
        upsert: jest.fn().mockResolvedValue(undefined),
        save: jest.fn((entity) =>
          entity === Kudos ? { id: 'newk' } : { email: 'bob@x.com' },
        ),
        findOneOrFail: jest.fn().mockResolvedValue({ id: 11, name: 'Aim High' }),
        findOne: jest.fn((entity: unknown) =>
          entity === Kudos ? fullKudos : null,
        ),
        increment: jest.fn(),
        decrement: jest.fn(),
        delete: jest.fn(),
      };
    }

    it('creates kudos when receiver does not exist (anonymous + images)', async () => {
      const em = makeEm(
        makeKudos({ id: 'newk', isAnonymous: true, senderAlias: 'Anon' }),
      );
      dataSource.transaction.mockImplementation((cb) => cb(em));
      const res = await service.create(
        {
          ...dtoBase,
          isAnonymous: true,
          senderAlias: 'Anon',
          title: '  Title  ',
          imageKeys: ['kudos-images/alice@x.com/a.png'],
        },
        jwtUser,
      );
      expect(em.save).toHaveBeenCalled();
      expect(res.id).toBe('newk');
    });

    it('creates kudos when receiver already exists (non-anonymous, no title)', async () => {
      const em = makeEm(makeKudos({ id: 'newk' }));
      em.findOne = jest.fn((entity: unknown) =>
        entity === Kudos ? makeKudos({ id: 'newk' }) : { email: 'bob@x.com' },
      );
      dataSource.transaction.mockImplementation((cb) => cb(em));
      const res = await service.create(dtoBase, jwtUser);
      expect(res.id).toBe('newk');
    });

    it('rejects image keys not owned by the user', async () => {
      const em = makeEm(makeKudos());
      dataSource.transaction.mockImplementation((cb) => cb(em));
      await expect(
        service.create(
          { ...dtoBase, imageKeys: ['kudos-images/hacker@x.com/a.png'] },
          jwtUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFound when created kudos cannot be reloaded', async () => {
      const em = makeEm(null);
      dataSource.transaction.mockImplementation((cb) => cb(em));
      await expect(service.create(dtoBase, jwtUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('like', () => {
    it('creates a like inside a transaction', async () => {
      kudosRepo.findOne.mockResolvedValue(makeKudos());
      likeRepo.findOne.mockResolvedValue(null);
      const em = {
        save: jest.fn(),
        increment: jest.fn(),
      };
      dataSource.transaction.mockImplementation((cb) => cb(em));
      await service.like('k1', 'me@x.com');
      expect(em.save).toHaveBeenCalledWith(Like, {
        kudosId: 'k1',
        userEmail: 'me@x.com',
      });
      expect(em.increment).toHaveBeenCalled();
    });

    it('throws NotFound when kudos missing', async () => {
      kudosRepo.findOne.mockResolvedValue(null);
      await expect(service.like('x', 'me@x.com')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws Conflict when already liked', async () => {
      kudosRepo.findOne.mockResolvedValue(makeKudos());
      likeRepo.findOne.mockResolvedValue({ kudosId: 'k1' });
      await expect(service.like('k1', 'me@x.com')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('unlike', () => {
    it('removes a like inside a transaction', async () => {
      kudosRepo.findOne.mockResolvedValue(makeKudos());
      likeRepo.findOne.mockResolvedValue({ kudosId: 'k1' });
      const em = { delete: jest.fn(), decrement: jest.fn() };
      dataSource.transaction.mockImplementation((cb) => cb(em));
      await service.unlike('k1', 'me@x.com');
      expect(em.delete).toHaveBeenCalled();
      expect(em.decrement).toHaveBeenCalled();
    });

    it('throws NotFound when kudos missing', async () => {
      kudosRepo.findOne.mockResolvedValue(null);
      await expect(service.unlike('x', 'me@x.com')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFound when not previously liked', async () => {
      kudosRepo.findOne.mockResolvedValue(makeKudos());
      likeRepo.findOne.mockResolvedValue(null);
      await expect(service.unlike('k1', 'me@x.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
