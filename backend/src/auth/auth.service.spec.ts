import { AuthService } from './auth.service';
import { GoogleUserDto } from './dto/google-user.dto';

describe('AuthService', () => {
  it('persists the user and signs a JWT payload built from the Google profile', async () => {
    const jwt = { sign: jest.fn().mockReturnValue('signed-token') };
    const usersService = {
      upsertFromGoogle: jest.fn().mockResolvedValue(undefined),
    };
    const service = new AuthService(jwt as never, usersService as never);
    const user: GoogleUserDto = {
      email: 'a@x.com',
      firstName: 'Al',
      lastName: 'Ice',
      picture: 'p',
      accessToken: 'gtoken',
    };

    const token = await service.login(user);

    expect(token).toBe('signed-token');
    expect(usersService.upsertFromGoogle).toHaveBeenCalledWith(user);
    expect(jwt.sign).toHaveBeenCalledWith({
      sub: 'a@x.com',
      email: 'a@x.com',
      firstName: 'Al',
      lastName: 'Ice',
      picture: 'p',
    });
  });
});
