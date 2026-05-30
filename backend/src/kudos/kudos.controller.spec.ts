import { BadRequestException } from '@nestjs/common';
import { KudosController } from './kudos.controller';

const req = { user: { email: 'me@x.com', firstName: 'Me', lastName: 'User' } };

describe('KudosController', () => {
  let controller: KudosController;
  let service: Record<string, jest.Mock>;
  let s3: { upload: jest.Mock; getPresignedUrl: jest.Mock };

  beforeEach(() => {
    service = {
      findAll: jest.fn().mockResolvedValue('all'),
      findHighlight: jest.fn().mockResolvedValue('highlight'),
      findSpotlight: jest.fn().mockResolvedValue('spotlight'),
      findSpotlightRecent: jest.fn().mockResolvedValue('recent'),
      getRecipientProfile: jest.fn().mockResolvedValue('profile'),
      getStats: jest.fn().mockResolvedValue('stats'),
      findOne: jest.fn().mockResolvedValue('one'),
      create: jest.fn().mockResolvedValue('created'),
      like: jest.fn().mockResolvedValue(undefined),
      unlike: jest.fn().mockResolvedValue(undefined),
    };
    s3 = {
      upload: jest.fn().mockResolvedValue('kudos-images/me@x.com/a.png'),
      getPresignedUrl: jest.fn().mockResolvedValue('https://signed'),
    };
    controller = new KudosController(service as never, s3 as never);
  });

  it('findAll delegates with user email', async () => {
    await controller.findAll({ page: 1 }, req as never);
    expect(service.findAll).toHaveBeenCalledWith({ page: 1 }, 'me@x.com');
  });

  it('findHighlight passes filters and email', async () => {
    await controller.findHighlight(req as never, 'Aim High', 'CTO');
    expect(service.findHighlight).toHaveBeenCalledWith(
      'Aim High',
      'CTO',
      'me@x.com',
    );
  });

  it('findSpotlight / findSpotlightRecent delegate', async () => {
    await controller.findSpotlight();
    await controller.findSpotlightRecent();
    expect(service.findSpotlight).toHaveBeenCalled();
    expect(service.findSpotlightRecent).toHaveBeenCalled();
  });

  it('getRecipientProfile delegates', async () => {
    await controller.getRecipientProfile('bob@x.com');
    expect(service.getRecipientProfile).toHaveBeenCalledWith('bob@x.com');
  });

  it('getStats delegates with email', async () => {
    await controller.getStats(req as never);
    expect(service.getStats).toHaveBeenCalledWith('me@x.com');
  });

  it('findOne delegates with id and email', async () => {
    await controller.findOne('k1', req as never);
    expect(service.findOne).toHaveBeenCalledWith('k1', 'me@x.com');
  });

  it('create delegates with dto and user', async () => {
    const dto = { receiverEmail: 'b@x.com', message: 'm', hashtags: [] };
    await controller.create(dto as never, req as never);
    expect(service.create).toHaveBeenCalledWith(dto, req.user);
  });

  it('like / unlike delegate', async () => {
    await controller.like('k1', req as never);
    await controller.unlike('k1', req as never);
    expect(service.like).toHaveBeenCalledWith('k1', 'me@x.com');
    expect(service.unlike).toHaveBeenCalledWith('k1', 'me@x.com');
  });

  describe('uploadImage', () => {
    it('uploads file and returns key + url', async () => {
      const file = { originalname: 'a.png' } as Express.Multer.File;
      const res = await controller.uploadImage(file, req as never);
      expect(s3.upload).toHaveBeenCalledWith(file, 'kudos-images/me@x.com');
      expect(res).toEqual({
        key: 'kudos-images/me@x.com/a.png',
        url: 'https://signed',
      });
    });

    it('throws when no file uploaded', async () => {
      await expect(
        controller.uploadImage(undefined as never, req as never),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
