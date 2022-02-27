import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: "password doesn't empty" })
  password: string;

  @IsNotEmpty({ message: "email doesn't empty" })
  @IsEmail({}, { message: 'please enter a valid email' })
  email: string;
}
