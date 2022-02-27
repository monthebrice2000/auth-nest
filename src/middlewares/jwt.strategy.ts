import { Injectable, NestMiddleware } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '@models/user.interface';
import { UsersService } from '@services/users.service';
import { UserDto } from '@models/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.jwt_secret,
    });
  }

  async validate(payload: User): Promise<User> {
    const user = await this.usersService.login({ ...payload });
    return user;
  }
}
