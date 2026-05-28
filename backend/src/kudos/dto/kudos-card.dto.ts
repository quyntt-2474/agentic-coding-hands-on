export class KudosUserDto {
  email: string;
  name: string;
  picture: string;
  department: string;
  stars: number;
}

export class KudosCardDto {
  id: string;
  sender: KudosUserDto;
  receiver: KudosUserDto;
  /** Danh hiệu — short title/badge for this kudos */
  title: string | null;
  message: string;
  hashtags: string[];
  likeCount: number;
  /** true if the requesting user has liked this kudos */
  likedByMe: boolean;
  isAnonymous: boolean;
  /** Alias display name when isAnonymous is true */
  senderAlias: string | null;
  /** Pre-signed S3 URLs for attached images */
  imageUrls: string[];
  createdAt: string; // ISO 8601
}
