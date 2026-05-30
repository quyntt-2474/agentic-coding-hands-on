import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateKudosDto {
  @IsEmail()
  receiverEmail: string;

  /** Danh hiệu — short title/badge shown as the kudos heading. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsString()
  @MaxLength(5000)
  message: string;

  @IsArray()
  @IsString({ each: true })
  hashtags: string[];

  /** Whether the sender wants to remain anonymous. */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isAnonymous?: boolean;

  /** Display name shown instead of real sender name when isAnonymous is true. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  senderAlias?: string;

  /**
   * S3 object keys of uploaded images (max 5).
   * Keys must match the pattern uploaded via POST /kudos/images.
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  imageKeys?: string[];
}
