import { IsNotEmpty } from "class-validator";

export class SigninDTO {
  @IsNotEmpty({ message: 'Email address field is required' })
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  password: string;
}
