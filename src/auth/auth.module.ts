import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { BcryptService } from 'src/services/bcrypt.service';
import User from 'src/user/models/user';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { AuthService } from './services/auth.service';
import { JwtConfigService } from './services/jwt-config.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    SequelizeModule.forFeature([User])
  ],
  providers: [JwtStrategy, AdminGuard, UserGuard, JwtConfigService, AuthService, BcryptService],
  exports: [JwtStrategy, AdminGuard, UserGuard, JwtConfigService, AuthService, JwtModule, PassportModule],
})
export class AuthModule { }
