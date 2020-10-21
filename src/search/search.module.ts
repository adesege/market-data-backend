import { Module } from '@nestjs/common';
import { MarketModule } from 'src/market/market.module';
import { SearchController } from './controllers/search/search.controller';

@Module({
  imports: [MarketModule],
  controllers: [SearchController]
})
export class SearchModule { }
