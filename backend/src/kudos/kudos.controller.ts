import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from '../s3/s3.service';
import { CreateKudosDto } from './dto/create-kudos.dto';
import { KudosQueryDto } from './dto/kudos-query.dto';
import { JwtUser, KudosService } from './kudos.service';

interface AuthRequest {
  user: JwtUser;
}

/** Max 5 MB per image */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
/** Accepted MIME types for kudos images */
const ALLOWED_MIME = /^image\/(jpeg|png|gif|webp)$/;

@Controller('kudos')
export class KudosController {
  constructor(
    private readonly kudosService: KudosService,
    private readonly s3: S3Service,
  ) {}

  /** GET /kudos — paginated list (auth required) */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: KudosQueryDto, @Request() req: AuthRequest) {
    return this.kudosService.findAll(query, req.user.email);
  }

  /** GET /kudos/highlight — top 5 by likes (auth required) */
  @UseGuards(JwtAuthGuard)
  @Get('highlight')
  findHighlight(
    @Request() req: AuthRequest,
    @Query('hashtag') hashtag?: string,
    @Query('department') department?: string,
  ) {
    return this.kudosService.findHighlight(hashtag, department, req.user.email);
  }

  /** GET /kudos/spotlight — word cloud data (public) */
  @Get('spotlight')
  findSpotlight() {
    return this.kudosService.findSpotlight();
  }

  /** GET /kudos/stats — current user stats (auth required) */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@Request() req: AuthRequest) {
    return this.kudosService.getStats(req.user.email);
  }

  /** GET /kudos/:id — single kudos detail (auth required) */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.kudosService.findOne(id, req.user.email);
  }

  /** POST /kudos — create kudos (auth required) */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateKudosDto, @Request() req: AuthRequest) {
    return this.kudosService.create(dto, req.user);
  }

  /**
   * POST /kudos/images — upload a single image to S3 (auth required).
   * Returns { key } — store this key in the form and send it with POST /kudos.
   */
  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_SIZE },
      fileFilter: (_, file, cb) => {
        if (!ALLOWED_MIME.test(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Only image files are allowed (jpg, png, gif, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthRequest,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    // Scope key to uploading user — enables ownership validation on kudos creation
    const folder = `kudos-images/${req.user.email}`;
    const key = await this.s3.upload(file, folder);
    const url = await this.s3.getPresignedUrl(key);
    return { key, url };
  }

  /** POST /kudos/:id/like — like a kudos (auth required) */
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.kudosService.like(id, req.user.email);
  }

  /** DELETE /kudos/:id/like — unlike a kudos (auth required) */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.kudosService.unlike(id, req.user.email);
  }
}
