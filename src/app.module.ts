import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeConfigService } from './services/sequelize-config.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(5100),
        DATABASE_URL: Joi.string().uri().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }).required()
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule,
    UserModule,
  ],
  providers: [SequelizeConfigService],
})
export class AppModule { }
