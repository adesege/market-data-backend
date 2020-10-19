import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UserDecorator } from 'src/decroators/user.decorator';
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
}
