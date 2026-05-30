import { HashtagsController } from './hashtags.controller';

describe('HashtagsController', () => {
  it('delegates findAll to the service', async () => {
    const service = { findAll: jest.fn().mockResolvedValue(['a']) };
    const controller = new HashtagsController(service as never);
    await expect(controller.findAll()).resolves.toEqual(['a']);
    expect(service.findAll).toHaveBeenCalled();
  });
});
