import { Injectable } from '@nestjs/common';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import User from 'src/user/models/user';
import { ConfigService } from './config.service';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createSequelizeOptions(): SequelizeModuleOptions {
    const url = new URL(this.configService.get('DATABASE_URL'));
    return {
      dialect: 'postgres',
      host: url.hostname,
      port: Number(url.port),
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      models: [User],
    }
  }
}
