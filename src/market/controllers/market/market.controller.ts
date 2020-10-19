import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UserDecorator } from 'src/decroators/user.decorator';
import { IMapGeocode } from 'src/interfaces/map';
import { CreateMarketDTO } from 'src/market/interfaces/market.dto';
import Market from 'src/market/models/market';
import { MapService } from 'src/services/map.service';

@Controller('markets')
@UseGuards(AdminGuard)
export class MarketController {
  constructor(
    @InjectModel(Market) private readonly marketModel: typeof Market,
    private readonly mapService: MapService
  ) { }

  @Post()
  async createMarket(@UserDecorator('id') userId: string, @Body() body: CreateMarketDTO): Promise<Market> {
    const geocode = await this.mapService.geocode({ address: body.address });
    const market = await this.marketModel.create({
      ...body,
      address: geocode.address,
      ownerId: userId,
      longitude: geocode.longitude,
      latitude: geocode.latitude
    });

    return market;
  }

  @Patch(':id')
  async updateMarket(
    @UserDecorator('id') userId: string,
    @Param('id') marketId: string,
    @Body() body: CreateMarketDTO
  ): Promise<Market> {
    const market = await this.marketModel.findOne({ where: { id: marketId, ownerId: userId } });
    if (!market) {
      throw new NotFoundException('Market not found');
    }
    let geocode: IMapGeocode = {
      address: market.address,
      longitude: market.longitude,
      latitude: market.latitude
    };
    if (market.address !== body.address) {
      geocode = await this.mapService.geocode({ address: body.address });
    }
    const entity = {
      ...market.toJSON(),
      ...body,
      ...geocode,
    } as Market;
    await this.marketModel.update(entity, { where: { id: marketId, ownerId: userId } });

    return entity;
  }

  @Get(':id?')
  async getMarkets(@Param('id') id: string): Promise<Market | Market[]> {
    const where = id ? { id } : undefined;
    const markets = await this.marketModel.findAll({
      where,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'ownerId']
      }
    });

    return id ? markets[0] : markets;
  }

  @Delete(':id')
  async deleteMarket(
    @UserDecorator('id') ownerId: string,
    @Param('id') id: string
  ): Promise<{ message: string }> {
    await this.marketModel.destroy({ where: { id, ownerId } });
    return { message: 'success' }
  }
}
