import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(9, { message: 'Password must be at least 9 characters long' })
  password: string;
}
