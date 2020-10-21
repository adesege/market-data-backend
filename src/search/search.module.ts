import { Module } from '@nestjs/common';
import { MarketModule } from 'src/market/market.module';
import { SearchController } from './controllers/search/search.controller';
import { SearchService } from './services/search.service';

@Module({
  imports: [MarketModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule { }
