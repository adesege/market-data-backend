import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IRoles } from 'src/interfaces/role';
import User from 'src/user/models/user';
import { BcryptService } from '../../services/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly bcryptService: BcryptService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userModel.findOne({
      where: {
        email: email,
        roles: {
          [Op.contains]: [IRoles.ADMIN]
        }
      },
      attributes: ['email', 'password', 'id', 'firstName', 'lastName', 'roles']
    });
    if (!user) return null;

    const isEqual = await this.bcryptService.compare(password, user.password);
    if (isEqual) {
      return { ...user.get(), password: undefined };
    }
    return null;
  }

  signToken(user: Partial<User>): Promise<string> {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      id: user.id
    };
    return this.jwtService.signAsync(payload);
  }
}
