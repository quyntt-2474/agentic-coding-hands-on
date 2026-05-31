import { HashtagsService } from './hashtags.service';
import { Hashtag } from '../database/entities/hashtag.entity';

describe('HashtagsService', () => {
  let service: HashtagsService;
  let repo: { find: jest.Mock };

  beforeEach(() => {
    repo = { find: jest.fn() };
    service = new HashtagsService(repo as never);
  });

  it('merges DB hashtags with canonical defaults, deduped and sorted', async () => {
    // "Aim High" exists in DB with a real id; the rest come from canonical defaults
    repo.find.mockResolvedValue([{ id: 100, name: 'Aim High' } as Hashtag]);

    const res = await service.findAll();

    const names = res.map((h) => h.name);
    expect(names).toContain('Aim High');
    expect(names).toContain('Wasshoi');
    // DB entry keeps its real id; defaults get negative placeholder ids
    expect(res.find((h) => h.name === 'Aim High')?.id).toBe(100);
    expect(res.find((h) => h.name === 'Wasshoi')?.id).toBeLessThan(0);
    // sorted ascending by name
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});
