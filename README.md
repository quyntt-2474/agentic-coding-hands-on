# Agentic Coding Hands-On

Dự án demo gồm frontend (Next.js) và backend (NestJS) với xác thực Google OAuth2 + JWT.

## Kiến trúc

```
frontend/   — Next.js 16.2.6 (React 19, TypeScript, Tailwind CSS v4)  → http://localhost:3001
backend/    — NestJS 11 (TypeScript, Passport.js, JWT)                 → http://localhost:3000
```

**Luồng đăng nhập:**
```
Browser → GET /auth/google → Google OAuth → /auth/google/callback → JWT → /auth/callback?token=<jwt> → localStorage → /
```

---

## Yêu cầu

- Node.js >= 20
- npm >= 10
- Tài khoản Google Cloud với OAuth2 credentials

---

## Cài đặt

### 1. Clone và cài dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Cấu hình biến môi trường backend

```bash
cd backend
cp .env.example .env
```

Điền các giá trị thực vào `backend/.env`:

```env
PORT=3000
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=<chuỗi_bí_mật_dài_ngẫu_nhiên>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3001
```

> Lấy `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` tại [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client IDs.
> Thêm `http://localhost:3000/auth/google/callback` vào danh sách **Authorized redirect URIs**.

### 3. Cấu hình biến môi trường frontend

File `frontend/.env.local` đã có sẵn. Kiểm tra nếu cần chỉnh:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

---

## Chạy dự án

Mở **2 terminal riêng biệt**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev -- --port 3001
```

Truy cập: **http://localhost:3001/login**

---

## Scripts

### Backend

| Lệnh | Mô tả |
|------|-------|
| `npm run start:dev` | Chạy dev mode (hot reload) |
| `npm run start` | Chạy production |
| `npm run build` | Build TypeScript |
| `npm run test` | Chạy unit tests |
| `npm run lint` | Lint code |

### Frontend

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev mode |
| `npm run build` | Build production |
| `npm run start` | Chạy production build |
| `npm run lint` | Lint code |

---

## Cấu trúc thư mục

```
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/            # GoogleUserDto
│   │   │   ├── guards/         # GoogleAuthGuard, JwtAuthGuard
│   │   │   ├── strategies/     # GoogleStrategy, JwtStrategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── login/page.tsx          # Trang đăng nhập
    │   └── auth/callback/page.tsx  # Xử lý JWT sau OAuth
    └── components/login/
        ├── login-header.tsx
        ├── login-hero.tsx          # Nút đăng nhập Google
        ├── login-footer.tsx
        └── language-selector.tsx   # Chọn ngôn ngữ VN/EN
```

---

## Lưu ý bảo mật

- **Không commit** file `backend/.env` — đã được gitignore
- `JWT_SECRET` phải là chuỗi ngẫu nhiên đủ dài (>= 32 ký tự) trong môi trường production
- Thay `FRONTEND_URL` và `GOOGLE_CALLBACK_URL` tương ứng khi deploy lên server thật
