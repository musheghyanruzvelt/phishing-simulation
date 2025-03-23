import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { User } from '@phishing-simulation/types';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(9, { message: 'Password must be at least 9 characters long' })
  password: string;

  @IsOptional()
  @IsIn(['ADMIN', 'USER'], { message: 'Invalid role' })
  role?: User['role'];
}
