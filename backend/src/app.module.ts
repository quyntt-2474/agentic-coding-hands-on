import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { KudosModule } from './kudos/kudos.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { DepartmentsModule } from './departments/departments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    KudosModule,
    HashtagsModule,
    DepartmentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
