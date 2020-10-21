import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, ProjectionAlias, Sequelize } from 'sequelize';
import Market from 'src/market/models/market';
import { SearchMarketDTO } from 'src/search/interfaces/search.dto';

@Controller('search')
export class SearchController {
  constructor(
    @InjectModel(Market) private readonly marketModel: typeof Market,
    private readonly sequelize: Sequelize
  ) { }

  @Get()
  async searchMarket(@Query() query: SearchMarketDTO): Promise<Market[]> {
    const sequelize = this.sequelize.Sequelize;

    const attributesIncludes = [
      'name',
      'description',
      'address',
      'images',
      'category',
      'longitude',
      'latitude',
    ] as (string | ProjectionAlias)[];

    const whereCategory = query.category ? { category: query.category } : {};
    const coordinateSubquery = sequelize.literal(`(SELECT ( 6371 * acos( cos( radians(${query.latitude}) ) * cos( radians( latitude ) ) * cos( radians(longitude) - radians(${query.longitude}) ) + sin( radians(${query.latitude}) ) * sin( radians( latitude ) ) ) ) as distance FROM "Markets" LIMIT 1)`);
    const whereCoordinates = query.isNearMe ? sequelize.where((coordinateSubquery), { [Op.lt]: 25 }) : {};
    const whereName = query.name ? sequelize.where(
      sequelize.fn('to_tsvector', sequelize.col('name')),
      '@@',
      sequelize.fn('plainto_tsquery', 'english', query.name),
    ) : {}

    if (query.isNearMe) attributesIncludes.push([coordinateSubquery, 'distance']);

    const markets = await this.marketModel.findAll({
      attributes: {
        include: attributesIncludes
      },
      where: {
        [Op.and]: [
          whereName,
          whereCategory,
          whereCoordinates
        ]
      },
    });

    if (!markets.length) {
      throw new NotFoundException('Your query did not return any result. Try again');
    }

    return markets;
  }
}
