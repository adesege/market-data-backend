import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { ConfigService } from './services/config.service';
import { SequelizeConfigService } from './services/sequelize-config/sequelize-config.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true, validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(5100),
        DATABASE_URL: Joi.string().uri().required()
      }).required()
    })
  ],
  controllers: [],
  providers: [SequelizeConfigService],
})
export class AppModule { }
