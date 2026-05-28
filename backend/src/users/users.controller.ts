import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  /** GET /users?search=q — search Sunners for recipient autocomplete (auth required). */
  @UseGuards(JwtAuthGuard)
  @Get()
  search(@Query('search') q: string) {
    return this.service.search(q ?? '');
  }
}
