import { Controller, Get } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly service: HashtagsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
