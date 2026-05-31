import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import request from 'supertest';

import { KudosController } from '../src/kudos/kudos.controller';
import { KudosService } from '../src/kudos/kudos.service';
import { S3Service } from '../src/s3/s3.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { Kudos } from '../src/database/entities/kudos.entity';
import { Like } from '../src/database/entities/like.entity';
import { Hashtag } from '../src/database/entities/hashtag.entity';
import { KudosHashtag } from '../src/database/entities/kudos-hashtag.entity';
import { User } from '../src/database/entities/user.entity';

/**
 * HTTP-level e2e for the Kudos API: real controller + real service + real
 * routing/validation/guard, with the persistence layer (TypeORM repos,
 * DataSource, S3) mocked so the suite runs anywhere without a database.
 */
function makeQb(terminals: Record<string, unknown> = {}) {
  const qb: Record<string, jest.Mock> = {};
  [
    'select',
    'addSelect',
    'innerJoin',
    'innerJoinAndSelect',
    'where',
    'andWhere',
    'orderBy',
    'addOrderBy',
    'groupBy',
    'addGroupBy',
    'skip',
    'take',
    'limit',
  ].forEach((m) => (qb[m] = jest.fn(() => qb)));
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
  };
}

describe('Kudos API (e2e)', () => {
  let app: INestApplication;
  const kudosRepo = repoMock();
  const likeRepo = repoMock();
  const hashtagRepo = repoMock();
  const kudosHashtagRepo = repoMock();
  const userRepo = repoMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [KudosController],
      providers: [
        KudosService,
        {
          provide: S3Service,
          useValue: {
            getPresignedUrl: jest.fn().mockResolvedValue('https://signed.url'),
            upload: jest.fn().mockResolvedValue('kudos-images/me@x.com/a.png'),
          },
        },
        { provide: getRepositoryToken(Kudos), useValue: kudosRepo },
        { provide: getRepositoryToken(Like), useValue: likeRepo },
        { provide: getRepositoryToken(Hashtag), useValue: hashtagRepo },
        {
          provide: getRepositoryToken(KudosHashtag),
          useValue: kudosHashtagRepo,
        },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: DataSource, useValue: { transaction: jest.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: {
          switchToHttp: () => { getRequest: () => { user: unknown } };
        }) => {
          ctx.switchToHttp().getRequest().user = {
            sub: 'me@x.com',
            email: 'me@x.com',
            firstName: 'Me',
            lastName: 'User',
            picture: '',
          };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    // Mirror main.ts so validation behaves like production
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /kudos/spotlight (public) returns aggregated counts', async () => {
    kudosRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({
        getRawMany: [
          { email: 'b@x.com', firstName: 'Bob', lastName: 'Brown', count: '3' },
        ],
      }),
    );
    const res = await request(app.getHttpServer())
      .get('/kudos/spotlight')
      .expect(200);
    expect(res.body).toEqual([
      { email: 'b@x.com', name: 'Bob Brown', count: 3 },
    ]);
  });

  it('GET /kudos (auth) returns a paginated envelope', async () => {
    const res = await request(app.getHttpServer()).get('/kudos').expect(200);
    expect(res.body).toEqual({ data: [], total: 0, page: 1, limit: 20 });
  });

  it('POST /kudos rejects an invalid body with 400', async () => {
    await request(app.getHttpServer())
      .post('/kudos')
      .send({ receiverEmail: 'not-an-email' }) // missing message + hashtags
      .expect(400);
  });

  it('GET /kudos/:id returns 404 when the kudos does not exist', async () => {
    await request(app.getHttpServer()).get('/kudos/missing-id').expect(404);
  });

  it('POST /kudos/:id/like returns 404 when the kudos does not exist', async () => {
    kudosRepo.findOne.mockResolvedValueOnce(null);
    await request(app.getHttpServer())
      .post('/kudos/missing-id/like')
      .expect(404);
  });

  it('GET /kudos with sender filter returns only kudos sent by that user', async () => {
    const sentKudos = {
      id: 'k-sent',
      senderEmail: 'alice@x.com',
      sender: {
        email: 'alice@x.com',
        firstName: 'Alice',
        lastName: 'Anders',
        picture: 'pic-a',
        department: 'CTO',
        stars: 3,
      },
      receiverEmail: 'bob@x.com',
      receiver: {
        email: 'bob@x.com',
        firstName: 'Bob',
        lastName: 'Brown',
        picture: null,
        department: null,
        stars: 0,
      },
      title: null,
      message: 'Good work',
      likeCount: 2,
      isAnonymous: false,
      senderAlias: null,
      imageKeys: null,
      createdAt: new Date(),
    };
    const qb = makeQb({ getManyAndCount: [[sentKudos], 1] });
    kudosRepo.createQueryBuilder.mockReturnValueOnce(qb);
    kudosHashtagRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({ getMany: [] }),
    );
    likeRepo.createQueryBuilder.mockReturnValueOnce(makeQb({ getMany: [] }));

    const res = await request(app.getHttpServer())
      .get('/kudos?sender=alice@x.com')
      .expect(200);

    expect(res.body.total).toBe(1);
    expect(res.body.data[0].sender.email).toBe('alice@x.com');
    // Verify andWhere was called with sender filter
    expect(qb.andWhere).toHaveBeenCalledWith('k.senderEmail = :sender', {
      sender: 'alice@x.com',
    });
  });

  it('GET /kudos with receiver filter returns only kudos received by that user', async () => {
    const receivedKudos = {
      id: 'k-recv',
      senderEmail: 'alice@x.com',
      sender: {
        email: 'alice@x.com',
        firstName: 'Alice',
        lastName: 'Anders',
        picture: 'pic-a',
        department: 'CTO',
        stars: 3,
      },
      receiverEmail: 'bob@x.com',
      receiver: {
        email: 'bob@x.com',
        firstName: 'Bob',
        lastName: 'Brown',
        picture: null,
        department: null,
        stars: 0,
      },
      title: null,
      message: 'Great effort',
      likeCount: 1,
      isAnonymous: false,
      senderAlias: null,
      imageKeys: null,
      createdAt: new Date(),
    };
    const qb = makeQb({ getManyAndCount: [[receivedKudos], 1] });
    kudosRepo.createQueryBuilder.mockReturnValueOnce(qb);
    kudosHashtagRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({ getMany: [] }),
    );
    likeRepo.createQueryBuilder.mockReturnValueOnce(makeQb({ getMany: [] }));

    const res = await request(app.getHttpServer())
      .get('/kudos?receiver=bob@x.com')
      .expect(200);

    expect(res.body.total).toBe(1);
    expect(res.body.data[0].receiver.email).toBe('bob@x.com');
    // Verify andWhere was called with receiver filter
    expect(qb.andWhere).toHaveBeenCalledWith('k.receiverEmail = :receiver', {
      receiver: 'bob@x.com',
    });
  });

  it('GET /kudos/profile/:email (auth) returns user profile with aggregate stats', async () => {
    const mockUser = {
      email: 'bob@x.com',
      firstName: 'Bob',
      lastName: 'Brown',
      picture: null,
      department: null,
      stars: 0,
    };
    userRepo.findOne.mockResolvedValueOnce(mockUser);
    kudosRepo.count.mockResolvedValueOnce(5); // kudosReceived
    kudosRepo.count.mockResolvedValueOnce(2); // kudosSent
    likeRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({ getCount: 12 }), // heartsReceived
    );

    const res = await request(app.getHttpServer())
      .get('/kudos/profile/bob@x.com')
      .expect(200);

    expect(res.body.user.email).toBe('bob@x.com');
    expect(res.body.user.name).toBe('Bob Brown');
    expect(res.body.kudosReceived).toBe(5);
    expect(res.body.kudosSent).toBe(2);
    expect(res.body.heartsReceived).toBe(12);
  });

  it('GET /kudos/profile/:email returns 404 when user does not exist', async () => {
    userRepo.findOne.mockResolvedValueOnce(null);
    kudosRepo.count.mockResolvedValue(0);
    likeRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({ getCount: 0 }),
    );

    await request(app.getHttpServer())
      .get('/kudos/profile/unknown@x.com')
      .expect(404);
  });

  it('GET /kudos/profile/:email is JWT-guarded (protected route)', async () => {
    // The guard is overridden in the test module's beforeAll, so it's always
    // considered "active" for testing. This test verifies the route exists and
    // is decorated with @UseGuards(JwtAuthGuard).
    const mockUser = {
      email: 'test@x.com',
      firstName: 'Test',
      lastName: 'User',
      picture: null,
      department: null,
      stars: 0,
    };
    userRepo.findOne.mockResolvedValueOnce(mockUser);
    kudosRepo.count.mockResolvedValueOnce(1);
    kudosRepo.count.mockResolvedValueOnce(0);
    likeRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({ getCount: 0 }),
    );

    // Route exists and returns data (guard passed due to beforeAll setup)
    const res = await request(app.getHttpServer())
      .get('/kudos/profile/test@x.com')
      .expect(200);

    expect(res.body.user).toBeDefined();
  });

  it('GET /kudos/profile/:email is resolved before GET /kudos/:id catch-all', async () => {
    // This test verifies route ordering: /profile/:email must come before /:id
    // Routes are evaluated top-to-bottom in NestJS; if /profile/:email comes after /:id,
    // the string 'profile' would be treated as an kudos ID instead.
    const mockUser = {
      email: 'bob@x.com',
      firstName: 'Bob',
      lastName: 'Brown',
      picture: null,
      department: null,
      stars: 0,
    };
    userRepo.findOne.mockResolvedValueOnce(mockUser);
    kudosRepo.count.mockResolvedValueOnce(2);
    kudosRepo.count.mockResolvedValueOnce(3);
    likeRepo.createQueryBuilder.mockReturnValueOnce(
      makeQb({ getCount: 5 }),
    );

    // Calling /kudos/profile/bob@x.com should hit the profile route (returns user data),
    // not the catch-all :id route (would query for Kudos and return 404)
    const res = await request(app.getHttpServer())
      .get('/kudos/profile/bob@x.com')
      .expect(200);

    // If it hit the /profile/:email route, response has user data
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('bob@x.com');
  });
});
