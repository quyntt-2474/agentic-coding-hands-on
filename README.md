# Sun\* Kudos
## Link Demo: https://ssa-two-theta.vercel.app/

Bảng ghi nhận (kudos board) nội bộ: nhân viên gửi lời cảm ơn / ghi nhận tới đồng nghiệp, gắn hashtag, like, xem highlight và spotlight theo thời gian thực.

Monorepo gồm **frontend** (Next.js) và **backend** (NestJS), xác thực bằng Google OAuth2 + JWT, lưu trữ trên PostgreSQL, ảnh đính kèm trên AWS S3.

## Kiến trúc

```
frontend/   — Next.js 16.2.6 (React 19, TypeScript, Tailwind CSS v4, Tiptap, d3-cloud)  → http://localhost:3001
backend/    — NestJS 11 (TypeScript, TypeORM, Passport, JWT, AWS SDK v3)                → http://localhost:3000
db          — PostgreSQL 16 (Docker Compose/Local, database: saa_kudos)                       → localhost:5432
```

**Luồng đăng nhập:**
```
Browser → GET /auth/google → Google OAuth → /auth/google/callback → JWT → /auth/callback?token=<jwt> → localStorage → /kudos
```

**Luồng gửi kudos:** upload ảnh (`POST /kudos/images` → S3 key) → tạo kudos (`POST /kudos` với message, receiver, hashtags, ảnh, ẩn danh tuỳ chọn).

---

## Yêu cầu

- Node.js >= 20, npm >= 10
- Docker + Docker Compose (cho PostgreSQL - optional)
- Tài khoản Google Cloud với OAuth2 credentials
- (Tuỳ chọn) AWS S3 bucket + credentials để upload ảnh kudos

---

## Cài đặt & chạy

### 1. Khởi động database (hoặc sử dụng local database thay cho docker)

```bash
docker compose up -d db   # PostgreSQL 16 trên cổng 5432, database saa_kudos
```

### 2. Cài dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Cấu hình biến môi trường backend

```bash
cd backend && cp .env.example .env
```

Điền giá trị thực vào `backend/.env`:

```env
PORT=3000

# Google OAuth2 + JWT
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=<chuỗi_bí_mật_dài_ngẫu_nhiên>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3001

# PostgreSQL (khớp với docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=saa_kudos

# AWS S3 (upload ảnh kudos)
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=<aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<aws_secret_access_key>
S3_BUCKET_NAME=<s3_bucket_name>
```

> Lấy `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` tại [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client IDs.

### 4. Chạy migrations

```bash
cd backend && npm run migration:run
```

### 5. Cấu hình frontend

File `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### 6. Chạy ứng dụng

Mở **2 terminal**:

```bash
# Terminal 1 — Backend
cd backend && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm run dev -- --port 3001
```

Truy cập: **http://localhost:3001/login**

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|:----:|-------|
| GET | `/auth/google` | – | Bắt đầu OAuth, redirect tới Google |
| GET | `/auth/google/callback` | – | Callback, phát JWT rồi redirect về frontend |
| GET | `/kudos` | JWT | Feed phân trang (lọc theo hashtag/department/sender/receiver) |
| GET | `/kudos/highlight` | JWT | Top kudos theo lượt like |
| GET | `/kudos/spotlight` | – | Dữ liệu word cloud |
| GET | `/kudos/spotlight/recent` | – | 7 người nhận kudos gần nhất |
| GET | `/kudos/profile/:email` | JWT | Profile + tổng hợp stats của user (kudosReceived, kudosSent, heartsReceived) |
| GET | `/kudos/stats` | JWT | Thống kê của user hiện tại |
| GET | `/kudos/:id` | JWT | Chi tiết một kudos |
| POST | `/kudos` | JWT | Tạo kudos mới |
| POST | `/kudos/images` | JWT | Upload 1 ảnh lên S3 → trả `{ key, url }` (max 5MB, jpg/png/gif/webp) |
| POST | `/kudos/:id/like` | JWT | Like |
| DELETE | `/kudos/:id/like` | JWT | Bỏ like |
| GET | `/hashtags` | – | Danh sách hashtag |
| GET | `/departments` | – | Danh sách phòng ban |
| GET | `/users?search=q` | JWT | Tìm user theo tên/email (ILIKE) |

---

## Mô hình dữ liệu

```
User (email PK, firstName, lastName, picture, department, stars, createdAt)
Kudos (id, senderEmail→User, receiverEmail→User, title, message, likeCount,
        isAnonymous, senderAlias, imageKeys[], createdAt)
Like (id, kudosId→Kudos, userEmail→User)          # ràng buộc unique chống like trùng
Hashtag (id, name unique)
KudosHashtag (kudosId→Kudos, hashtagId→Hashtag)    # bảng nối many-to-many
```

---

## Scripts

### Backend

| Lệnh | Mô tả |
|------|-------|
| `npm run start:dev` | Dev mode (hot reload) |
| `npm run build` / `npm run start:prod` | Build & chạy production |
| `npm run test` / `npm run test:cov` | Unit test / coverage |
| `npm run lint` | Lint (ESLint --fix) |
| `npm run migration:run` | Chạy migrations |
| `npm run migration:revert` | Rollback migration gần nhất |
| `npm run migration:generate -- <name>` | Sinh migration từ thay đổi entity |
| `npm run migration:show` | Liệt kê trạng thái migrations |

### Frontend

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Dev mode |
| `npm run build` / `npm run start` | Build & chạy production |
| `npm run lint` | Lint |

---

## Cấu trúc thư mục

```
├── docker-compose.yml          # PostgreSQL 16
├── backend/                    # NestJS 11 + TypeORM
│   └── src/
│       ├── auth/               # Google OAuth2 + JWT (strategies, guards, dto)
│       ├── database/
│       │   ├── entities/       # User, Kudos, Like, Hashtag, KudosHashtag
│       │   ├── migrations/     # TypeORM migrations
│       │   ├── data-source.ts  # DataSource cho TypeORM CLI
│       │   └── database.module.ts
│       ├── kudos/              # Controller, service, DTOs (feed, like, create, upload)
│       ├── hashtags/           # GET /hashtags
│       ├── departments/        # GET /departments
│       ├── users/              # GET /users (search)
│       ├── s3/                 # S3Service (upload, presigned URL, delete)
│       └── main.ts             # bootstrap, CORS, global ValidationPipe
└── frontend/                   # Next.js 16 App Router
    ├── app/
    │   ├── login/              # Trang đăng nhập
    │   ├── auth/callback/      # Nhận JWT sau OAuth
    │   ├── kudos/              # Trang kudos + @modal parallel route cho detail
    │   ├── profile/[email]/    # Trang hồ sơ người dùng (stats, kudos đã gửi/nhận)
    │   ├── awards/ · countdown/ · community-standards/
    │   └── layout.tsx · page.tsx
    ├── components/
    │   ├── kudos/              # feed, write-modal, carousel, spotlight, sidebar...
    │   ├── homepage/ · login/ · award-info/ · community-standards/
    │   └── auth/auth-guard.tsx
    └── lib/                    # api.ts, jwt.ts, i18n.ts, sanitize-html.ts...
