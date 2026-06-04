# Phase 01 — Backend: Google OAuth + JWT

**Status:** Pending | **Priority:** High

## Overview
Add Google OAuth2 authentication to the NestJS backend. After Google callback, sign a JWT and redirect browser to frontend callback URL with token in query param.

## Files to Create
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/strategies/google.strategy.ts`
- `backend/src/auth/strategies/jwt.strategy.ts`
- `backend/src/auth/guards/google-auth.guard.ts`
- `backend/src/auth/guards/jwt-auth.guard.ts`
- `backend/src/auth/dto/google-user.dto.ts`
- `backend/.env.example`

## Files to Modify
- `backend/src/app.module.ts` — import ConfigModule + AuthModule
- `backend/src/main.ts` — enable CORS for http://localhost:3001

## New Packages
```
@nestjs/config @nestjs/passport @nestjs/jwt passport passport-google-oauth20 passport-jwt
@types/passport-google-oauth20 @types/passport-jwt
```

## Auth Flow
1. `GET /auth/google` → GoogleAuthGuard redirects to Google consent screen
2. `GET /auth/google/callback` → GoogleAuthGuard handles callback, calls AuthService.login()
3. AuthService signs JWT with user info (email, name, picture)
4. Controller redirects to `http://localhost:3001/auth/callback?token=<jwt>`

## ENV Vars (.env.example)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3001
PORT=3000
```

## Implementation Steps
1. Install packages
2. Create `.env.example` and `.env` (gitignored)
3. Implement GoogleUserDto
4. Implement GoogleStrategy (validate returns user object)
5. Implement JwtStrategy (validate returns payload)
6. Implement AuthService (login → sign JWT)
7. Implement AuthController (google route + callback route)
8. Implement AuthModule (imports: ConfigModule, PassportModule, JwtModule)
9. Update AppModule to import ConfigModule.forRoot() + AuthModule
10. Update main.ts: enable CORS origin http://localhost:3001

## Success Criteria
- `GET http://localhost:3000/auth/google` redirects to Google OAuth
- After Google auth, browser is redirected to `http://localhost:3001/auth/callback?token=<jwt>`
- JWT payload contains: email, name, picture, sub
