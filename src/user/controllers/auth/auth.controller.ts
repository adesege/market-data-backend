import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuthService } from 'src/auth/services/auth.service';
import { BcryptService } from 'src/services/bcrypt.service';
import { SigninDTO } from 'src/user/interfaces/signin.dto';
import { CreateUserDTO } from 'src/user/interfaces/signup.dto';
import User from 'src/user/models/user';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly authService: AuthService,
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly sequelize: Sequelize
  ) { }

  @Post('signin')
  async signin(@Body() body: SigninDTO): Promise<{ token: string }> {
    const ERROR_MESSAGE = 'Username or password is wrong';
    const user = await this.userModel.findOne({ where: { email: body.email } });
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    const isEqual = await this.bcryptService.compare(body.password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    const token = await this.authService.signToken(user);
    return { token: token };
  }


  @Post('signup')
  async signup(@Body() body: CreateUserDTO): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { email: body.email } });
    if (!!user) {
      throw new ConflictException('Email is already taken');
    }

    const password = await this.bcryptService.hash(body.password);
    this.sequelize.transaction(async transaction => {
      await this.userModel.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password
      }, { transaction });
    });

    return { message: 'success' }
  }
}