const mockSend = jest.fn().mockResolvedValue({});

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn((input: unknown) => ({ input })),
  DeleteObjectCommand: jest.fn((input: unknown) => ({ input })),
  GetObjectCommand: jest.fn((input: unknown) => ({ input })),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://presigned.url'),
}));

import { S3Service } from './s3.service';

function makeConfig(): { get: jest.Mock; getOrThrow: jest.Mock } {
  return {
    // credentials present → exercises the credentials branch
    get: jest.fn((key: string) =>
      key === 'AWS_ACCESS_KEY_ID'
        ? 'AKIA'
        : key === 'AWS_SECRET_ACCESS_KEY'
          ? 'secret'
          : undefined,
    ),
    getOrThrow: jest.fn((key: string) =>
      key === 'AWS_REGION' ? 'ap-southeast-1' : 'my-bucket',
    ),
  };
}

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(() => {
    mockSend.mockClear();
    service = new S3Service(makeConfig() as never);
  });

  it('uploads a buffer and returns a folder-scoped key', async () => {
    const file = {
      originalname: 'photo.png',
      buffer: Buffer.from('x'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    const key = await service.upload(file, 'kudos-images/me@x.com');

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(key.startsWith('kudos-images/me@x.com/')).toBe(true);
    expect(key.endsWith('.png')).toBe(true);
  });

  it('uses the default folder when none is given', async () => {
    const file = {
      originalname: 'doc.pdf',
      buffer: Buffer.from('x'),
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    const key = await service.upload(file);
    expect(key.startsWith('kudos-images/')).toBe(true);
    expect(key.endsWith('.pdf')).toBe(true);
  });

  it('returns a pre-signed GET url', async () => {
    await expect(service.getPresignedUrl('some/key')).resolves.toBe(
      'https://presigned.url',
    );
  });

  it('deletes an object by key', async () => {
    await service.delete('some/key');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
