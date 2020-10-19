import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import User from 'src/user/models/user';
import { ConfigService } from '../../services/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, @InjectModel(User) private readonly userModel: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: User): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel.findByPk(payload.id, {
      attributes: ['id', 'firstName', 'lastName', 'roles']
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
