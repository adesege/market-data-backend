import { IsNotEmpty } from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Email address field is required' })
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  password: string;

  @IsNotEmpty({ message: 'First name field is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name field is required' })
  lastName: string;
}
