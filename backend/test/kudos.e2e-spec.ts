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
});
