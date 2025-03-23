import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@phishing-simulation/types';
import { LoginDto } from './dto/login.dto';
import { AuthTokenResponse } from 'src/interfaces/auth-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthTokenResponse> {
    const { email, password, role = 'USER' } = createUserDto;

    const existingUser = await this.userModel.exists({ email });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await this._hashPassword(password);

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      role,
    });

    return this._generateAuthToken(newUser);
  }

  async login(loginDto: LoginDto): Promise<AuthTokenResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this._generateAuthToken(user);
  }

  async validateUser(payload: { sub: string }): Promise<User | null> {
    return this.userModel.findById(payload.sub).select('-password');
  }

  private _generateAuthToken(user: User): AuthTokenResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async _hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
