import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';

function makeQb(users: Partial<User>[]) {
  const qb: Record<string, jest.Mock> = {};
  ['orderBy', 'where'].forEach((m) => (qb[m] = jest.fn(() => qb)));
  qb.getMany = jest.fn().mockResolvedValue(users);
  return qb;
}

describe('UsersService', () => {
  let service: UsersService;
  let repo: { createQueryBuilder: jest.Mock };
  let qb: ReturnType<typeof makeQb>;

  beforeEach(() => {
    qb = makeQb([
      { email: 'a@x.com', firstName: 'Al', lastName: 'Ice', picture: null as never },
    ]);
    repo = { createQueryBuilder: jest.fn(() => qb) };
    service = new UsersService(repo as never);
  });

  it('applies an ILIKE filter when a search term is given', async () => {
    const res = await service.search('al');
    expect(qb.where).toHaveBeenCalled();
    expect(res).toEqual([
      { email: 'a@x.com', name: 'Al Ice', picture: '', department: '' },
    ]);
  });

  it('returns all users (no filter) when the term is empty/blank', async () => {
    await service.search('   ');
    expect(qb.where).not.toHaveBeenCalled();
  });
});
