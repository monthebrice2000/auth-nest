import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  id?: number;

  @IsNotEmpty({ message: "password doesn't empty" })
  password: string;

  @IsNotEmpty({ message: "confirm password doesn't empty" })
  confirmPassword: string;

  @IsNotEmpty({ message: "token doesn't empty" })
  token: string;
}
