import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Market from 'src/market/models/market';
import { SearchMarketDTO } from 'src/search/interfaces/search.dto';
import { SearchService } from 'src/search/services/search.service';

@Controller('search')
export class SearchController {
  constructor(
    @InjectModel(Market) private readonly marketModel: typeof Market,
    private readonly searchService: SearchService
  ) { }

  @Get()
  async searchMarket(@Query() query: SearchMarketDTO): Promise<Market[]> {
    const hasCoordinates = !!query.latitude && !!query.longitude;
    let markets: Market[];

    if (hasCoordinates) {
      markets = await this.searchService.searchWithCoordinates(query);
    } else {
      markets = await this.searchService.searchWithoutCoordinates(query)
    }

    if (!markets.length) {
      throw new NotFoundException('Your query did not return any result. Try again');
    }

    return markets;
  }
}
