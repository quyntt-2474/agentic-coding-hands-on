export interface KudosUser {
  email: string;
  name: string;
  picture: string;
  department: string;
  stars: number;
}

export interface KudosCard {
  id: string;
  sender: KudosUser;
  receiver: KudosUser;
  /** Danh hiệu — short title/badge for this kudos */
  title: string | null;
  message: string;
  hashtags: string[];
  likeCount: number;
  /** true when the current authenticated user has liked this kudos */
  likedByMe: boolean;
  isAnonymous: boolean;
  /** Alias name shown when isAnonymous is true */
  senderAlias: string | null;
  /** Pre-signed S3 URLs for attached images */
  imageUrls: string[];
  createdAt: string; // ISO 8601
}

export interface SpotlightWord {
  name: string;
  email: string;
  count: number;
}

export interface KudosStats {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  recentRecipients: Pick<KudosUser, 'email' | 'name' | 'picture'>[];
}

export interface KudosListResponse {
  data: KudosCard[];
  total: number;
  page: number;
  limit: number;
}

export interface UserSearchResult {
  email: string;
  name: string;
  picture: string;
  department: string;
}

export interface Hashtag {
  id: string;
  name: string;
}

export interface CreateKudosDto {
  receiverEmail: string;
  /** Danh hiệu — short title/badge shown as the kudos heading */
  title?: string;
  message: string; // HTML content from Tiptap
  hashtags: string[]; // hashtag names
  /** S3 object keys returned by POST /kudos/images */
  imageKeys?: string[];
  isAnonymous: boolean;
  senderAlias?: string;
}
