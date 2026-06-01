import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };
  let config: { get: jest.Mock };

  beforeEach(() => {
    authService = { login: jest.fn().mockResolvedValue('jwt-token') };
    config = { get: jest.fn().mockReturnValue('http://front') };
    controller = new AuthController(authService as never, config as never);
  });

  it('googleAuth is a no-op (guard handles redirect)', () => {
    expect(controller.googleAuth()).toBeUndefined();
  });

  it('googleCallback signs a token and redirects to the frontend', async () => {
    const req = { user: { email: 'a@x.com' } };
    const res = { redirect: jest.fn() };
    await controller.googleCallback(req as never, res as never);
    expect(authService.login).toHaveBeenCalledWith(req.user);
    expect(res.redirect).toHaveBeenCalledWith(
      'http://front/auth/callback?token=jwt-token',
    );
  });
});
