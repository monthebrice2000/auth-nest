import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetDto {
  id?: number;

  @IsNotEmpty({ message: "email doesn't empty" })
  @IsEmail({}, { message: 'please enter a valid email' })
  email: string;
}
