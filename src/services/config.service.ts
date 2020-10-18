import { ConfigService as NestConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from 'src/interfaces/config';

export class ConfigService extends NestConfigService<IEnvironmentVariables> { }
