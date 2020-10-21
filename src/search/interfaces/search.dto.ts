import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, ValidateIf } from "class-validator";
import { IMarketCategories } from "src/market/interfaces/market";
import { enumToArray, toBoolean } from "src/utils";

export class SearchMarketDTO {
  @IsOptional()
  @ValidateIf((schema: SearchMarketDTO) => !schema.isNearMe && !schema.category)
  name: string;

  @IsOptional()
  @ValidateIf((schema: SearchMarketDTO) => !schema.isNearMe && !schema.name)
  @IsEnum(IMarketCategories, {
    message: `Categories must be one of ${enumToArray(IMarketCategories).join(', ')}`
  })
  category: IMarketCategories;

  @IsOptional()
  @Transform(value => toBoolean(value))
  @ValidateIf((schema: SearchMarketDTO) => !schema.name && !schema.category)
  @IsBoolean({ message: 'The near me field must be a boolean' })
  isNearMe: boolean;

  @IsOptional()
  @Transform(value => Number(value))
  @ValidateIf((schema: SearchMarketDTO) => schema.isNearMe)
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude: number;

  @IsOptional()
  @Transform(value => Number(value))
  @ValidateIf((schema: SearchMarketDTO) => schema.isNearMe)
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude: number;
}
