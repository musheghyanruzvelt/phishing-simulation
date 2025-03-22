import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export interface User {
  id?: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export interface PhishingAttempt {
  id?: string;
  recipientEmail: string;
  emailContent: string;
  status: 'PENDING' | 'SENT' | 'CLICKED' | 'FAILED';
  trackingToken: string;
  sentAt?: Date;
  clickedAt?: Date;
  createdBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export interface CreatePhishingAttemptDto {
  recipientEmail: string;
  emailTemplate: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsIn(['ADMIN', 'USER'], { message: 'Invalid role' })
  role?: User['role'];
}
