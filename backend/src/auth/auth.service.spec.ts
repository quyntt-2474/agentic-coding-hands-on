import { AuthService } from './auth.service';
import { GoogleUserDto } from './dto/google-user.dto';

describe('AuthService', () => {
  it('signs a JWT payload built from the Google profile', () => {
    const jwt = { sign: jest.fn().mockReturnValue('signed-token') };
    const service = new AuthService(jwt as never);
    const user: GoogleUserDto = {
      email: 'a@x.com',
      firstName: 'Al',
      lastName: 'Ice',
      picture: 'p',
      accessToken: 'gtoken',
    };

    const token = service.login(user);

    expect(token).toBe('signed-token');
    expect(jwt.sign).toHaveBeenCalledWith({
      sub: 'a@x.com',
      email: 'a@x.com',
      firstName: 'Al',
      lastName: 'Ice',
      picture: 'p',
    });
  });
});
