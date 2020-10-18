import { IsEmail, IsNotEmpty } from "class-validator";

export class SigninDTO {
  @IsNotEmpty({ message: 'Email address field is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  password: string;
}
