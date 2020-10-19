import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsUrl } from "class-validator";
import { enumToArray } from "src/utils";
import { IMarketCategories } from "./market";

export class CreateMarketDTO {
  @IsNotEmpty({ message: 'Market name is required' })
  name: string;

  @IsNotEmpty({ message: 'Market description is required' })
  description: string;

  @IsNotEmpty({ message: 'Market address is required' })
  address: string;

  @IsNotEmpty({ message: 'Market category is required' })
  @IsEnum(IMarketCategories, {
    message: `Categories must be one of ${enumToArray(IMarketCategories).join(', ')}`
  })
  category: IMarketCategories;

  @IsNotEmpty({ message: 'Market images is required', each: true })
  @IsArray({ message: 'Images must be an array' })
  @IsUrl({}, { message: 'Image url is not a valid url', each: true })
  @ArrayMaxSize(3, { message: 'Number of images must not be more than 3' })
  @ArrayMinSize(3, { message: 'Number of images must not be more than 3' })
  images: string[];
}
