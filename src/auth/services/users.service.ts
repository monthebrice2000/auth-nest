import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '@repositories/users.repository';
import { User } from '@models/user.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@models/user.entity';
var HmacSHA256 = require('crypto-js/sha256');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: User): Promise<User> {
    return await this.usersRepository.createUser(user);
  }

  async findUserByEmail(user: User): Promise<User> {
    return await this.usersRepository.findUserByEmail({ email: user.email });
  }

  async login(user: User): Promise<User> {
    const userFound = await this.usersRepository.findUserByEmail({
      email: user.email,
    });

    if (!userFound) {
      throw new NotFoundException("Email doesn't exists");
    }

    const hashedPassword = HmacSHA256(
      user.password,
      'tontonlaforce',
    ).words.join('-');
    if (hashedPassword !== userFound.password) {
      throw new NotFoundException('Invalid Credentials');
    }

    const token = await this.jwtService.signAsync(
      { ...userFound, password: user.password },
      { secret: process.env.jwt_secret },
    );

    return {
      ...userFound,
      password: user.password,
      hashedPassword: userFound.password,
      token: token,
    };
  }

  async updateUser(user: User): Promise<User> {
    const userFound = await this.usersRepository.findUserByEmail({
      email: user.email,
    });

    if (!userFound) {
      throw new NotFoundException("Email doesn't exists");
    }

    const hashedPassword = HmacSHA256(
      user.password,
      'tontonlaforce',
    ).words.join('-');

    await this.usersRepository.updateUser({
      ...userFound,
      password: hashedPassword,
    });

    return {
      ...userFound,
      password: user.password,
      hashedPassword: userFound.password,
    };
  }

  async getUser(token: string): Promise<User> {
    const user = await this.jwtService.verifyAsync(token);
    console.log(user);
    return user;
  }

  async logout(
    token: string,
  ): Promise<{ message: string; tokenExpire: string }> {
    const payload = this.jwtService.decode(token);
    const tokenExpires = await this.jwtService.signAsync(payload, {
      secret: 'otttt',
      expiresIn: 0,
    });
    return { message: 'success', tokenExpire: tokenExpires };
  }
}
