import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

interface IMapGeocode {
  address: string;
  longitude: string;
  latitude: string;
}

@Injectable()
export class MapService {
  private readonly apiKey = this.configService.get('GOOGLE_MAPS_KEY');

  constructor(private httpService: HttpService, private readonly configService: ConfigService) {
    this.httpService.axiosRef.defaults.baseURL = "https://maps.googleapis.com/maps/api/geocode/json";
    this.httpService.axiosRef.defaults.headers.accept = 'application/json';
  }

  async geocode(payload: { address: string }): Promise<IMapGeocode> {
    const response = await this.httpService.get('', {
      params: {
        address: payload.address,
        key: this.apiKey
      }
    }).toPromise();
    const [result] = response.data.results;

    if (!result) {
      throw new BadRequestException(
        'We are unable to locate this address. \
        You can refine it by adding city, state or country at the end'
      );
    }
    return {
      address: result.formatted_address,
      longitude: result.geometry.location.lng,
      latitude: result.geometry.location.lat,
    }
  }
}
