import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { AuthModule } from './auth/auth.module';
import { MarketModule } from './market/market.module';
import { SequelizeConfigService } from './services/sequelize-config.service';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';

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
        GOOGLE_MAPS_KEY: Joi.string().required(),
      }).required()
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule,
    UserModule,
    MarketModule,
    SearchModule,
  ],
  providers: [SequelizeConfigService],
})
export class AppModule { }
