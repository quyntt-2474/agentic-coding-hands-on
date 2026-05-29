import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Query params for GET /kudos — filtering and pagination. */
export class KudosQueryDto {
  /** Filter by hashtag name. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  hashtag?: string;

  /** Filter by receiver department. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  /** 1-based page number. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  /** Page size (max 50). */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
