import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Sequelize } from "sequelize";
import Market from "src/market/models/market";
import { SearchMarketDTO } from "../interfaces/search.dto";

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Market) private readonly marketModel: typeof Market,
    private readonly sequelize: Sequelize
  ) { }

  searchWithoutCoordinates(query: Partial<SearchMarketDTO>): Promise<Market[]> {
    const sequelize = this.sequelize.Sequelize;
    const whereCategory = query.category ? { category: query.category } : {};
    const whereName = query.name ? sequelize.where(
      sequelize.fn('to_tsvector', sequelize.col('name')),
      '@@',
      sequelize.fn('plainto_tsquery', 'english', query.name),
    ) : {}

    return this.marketModel.findAll({
      attributes: [
        'name',
        'description',
        'address',
        'images',
        'category',
        'longitude',
        'latitude',
      ],
      where: {
        [Op.and]: [
          whereName,
          whereCategory,
        ]
      },
    })
  }

  async searchWithCoordinates(query: Partial<SearchMarketDTO>): Promise<Market[]> {
    const hasCoordinates = !!query.latitude && !!query.longitude;
    const whereCategory = query.category ? 'AND category = :category' : '';
    const whereName = query.name ? "AND to_tsvector(name) @@ plainto_tsquery('english', :name)" : '';
    const whereDistance = hasCoordinates ? 'distance < :radiusMiles' : '';

    return this.marketModel.sequelize.query<Market>(`SELECT 
    name, 
    description,
     address,
      images, 
      category, 
      longitude, 
      latitude 
      FROM (
        SELECT *, ( 6371 * acos( cos( radians(:latitude) ) * cos( radians( latitude ) ) * cos( radians(longitude) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( latitude ) ) ) ) as distance FROM "Markets"
      ) as markets
      WHERE ${whereDistance} ${whereCategory} ${whereName} 
      `, {
      model: Market,
      mapToModel: true,
      replacements: {
        name: query.name,
        category: query.category,
        latitude: query.latitude,
        longitude: query.longitude,
        radiusMiles: 25
      }
    });
  }
}
