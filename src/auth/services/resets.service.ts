import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '@repositories/users.repository';
import { User } from '@models/user.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@models/user.entity';
import { ResetsRepository } from '@repositories/resets.repository';
import { Reset } from '@models/reset.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '@services/users.service';
var HmacSHA256 = require('crypto-js/sha256');

@Injectable()
export class ResetsService {
  constructor(
    @InjectRepository(ResetsRepository)
    private readonly resetsRepository: ResetsRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async createReset(reset: Reset): Promise<Reset> {
    const { email } = reset;

    const userFound = await this.usersService.findUserByEmail({ email });

    if (!userFound) {
      throw new NotFoundException('Email doesn t not found');
    }
    const token = await this.jwtService.signAsync(
      { email },
      { secret: process.env.jwt_secret, expiresIn: '15m' },
    );
    return await this.resetsRepository.createReset({ email, token });
  }

  async findResetAndUpdateUser(
    resetPassword: Reset,
  ): Promise<{ message: string }> {
    const { token } = resetPassword;

    await this.jwtService
      .verifyAsync(token, {
        secret: process.env.jwt_secret,
      })
      .catch((err) => {
        throw new RequestTimeoutException('Invalid Token for reset Password');
      });

    const resetFound = await this.resetsRepository.findResetByToken({ token });

    if (!resetFound) {
      throw new BadRequestException('Token doesn t found');
    }

    await this.usersService.updateUser({
      email: resetFound.email,
      password: resetPassword.password,
    });

    await this.resetsRepository.deleteReset(resetFound);

    return {
      message: 'reset password success',
    };
  }
}
