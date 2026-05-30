import { DepartmentsService } from './departments.service';

function makeQb(rows: { department: string }[]) {
  const qb: Record<string, jest.Mock> = {};
  ['select', 'where', 'andWhere'].forEach((m) => (qb[m] = jest.fn(() => qb)));
  qb.getRawMany = jest.fn().mockResolvedValue(rows);
  return qb;
}

describe('DepartmentsService', () => {
  it('merges canonical departments with distinct DB values, deduped and sorted', async () => {
    const repo = {
      createQueryBuilder: jest.fn(() =>
        makeQb([{ department: 'CTO' }, { department: 'NEW-DEPT' }]),
      ),
    };
    const service = new DepartmentsService(repo as never);

    const res = await service.findAll();

    expect(res).toContain('CTO'); // canonical + db, deduped to one
    expect(res).toContain('NEW-DEPT'); // db-only value included
    expect(res.filter((d) => d === 'CTO')).toHaveLength(1);
    const sorted = [...res].sort((a, b) => a.localeCompare(b));
    expect(res).toEqual(sorted);
  });
});
