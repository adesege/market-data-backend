import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { BcryptService } from 'src/services/bcrypt.service';
import { AuthController } from './controllers/auth/auth.controller';
import User from './models/user';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([User])],
  providers: [BcryptService, AuthService],
  controllers: [AuthController],
  exports: [SequelizeModule]
})
export class UserModule { }
