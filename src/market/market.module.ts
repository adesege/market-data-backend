import { HttpModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MapService } from 'src/services/map.service';
import { MarketController } from './controllers/market/market.controller';
import Market from './models/market';

@Module({
  imports: [SequelizeModule.forFeature([Market]), HttpModule],
  controllers: [MarketController],
  providers: [MapService],
  exports: [SequelizeModule]
})
export class MarketModule { }
