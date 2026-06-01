import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GoogleUserDto } from './dto/google-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(user: GoogleUserDto): Promise<string> {
    // Persist (or refresh) the user record on every successful login.
    await this.usersService.upsertFromGoogle(user);

    const payload = {
      sub: user.email,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    };
    return this.jwtService.sign(payload);
  }
}
