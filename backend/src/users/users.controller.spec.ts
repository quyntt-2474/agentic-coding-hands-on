import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let service: { search: jest.Mock };

  beforeEach(() => {
    service = { search: jest.fn().mockResolvedValue(['u']) };
    controller = new UsersController(service as never);
  });

  it('passes the search query through', async () => {
    await controller.search('bob');
    expect(service.search).toHaveBeenCalledWith('bob');
  });

  it('defaults a missing query to an empty string', async () => {
    await controller.search(undefined as never);
    expect(service.search).toHaveBeenCalledWith('');
  });
});
