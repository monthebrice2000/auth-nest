import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  id?: number;

  @IsNotEmpty({ message: "first_name doesn't empty" })
  first_name: string;

  @IsNotEmpty({ message: "last_name doesn't empty" })
  last_name: string;

  @IsNotEmpty({ message: "password doesn't empty" })
  password: string;

  @IsNotEmpty({ message: "confirm password doesn't empty" })
  confirmPassword: string;

  @IsNotEmpty({ message: "email doesn't empty" })
  @IsEmail({}, { message: 'please enter a valid email' })
  email: string;
}
