import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Request,
  Response,
  Headers,
  UseGuards,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { UsersService } from '@services/users.service';
import { UserDto } from '@models/user.dto';
import { UserLoginDto } from '@models/user.login.dto';
import { User } from '@models/user.interface';
import { AuthGuard } from '@middlewares/auth.guard';
import { AuthStrategy } from '@middlewares/auth.strategy';
import { Reset } from '@models/reset.interface';
import { ResetDto } from '@models/reset.dto';
import { ResetsService } from '@services/resets.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from '@models/reset.password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly resetsService: ResetsService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('/register')
  register(@Body('user') user: UserDto) {
    if (user.password !== user.confirmPassword) {
      throw new BadRequestException(
        "Password and confirm password doesn't match",
      );
    }
    return this.usersService.create({ ...user });
  }

  @Post('login')
  async login(
    @Body('user') user: UserLoginDto,
    @Res({ passthrough: true }) response,
  ): Promise<User> {
    console.log(user);
    const userLogged = await this.usersService.login(user);
    response.cookie('jwt', userLogged.token, { httpOnly: true });
    return userLogged;
  }

  @UseGuards(AuthStrategy)
  @Get('user')
  async getUser(@Req() request): Promise<User> {
    return await request.user;
  }

  @UseGuards(AuthStrategy)
  @Post('logout')
  async logout(
    @Req() request,
    @Headers('Authorization') headers: string,
  ): Promise<{ message: string; tokenExpires: string }> {
    const user = await request.user;
    if (!user) {
      throw new UnauthorizedException('Déjà Déconnecté');
    }

    const msgLogout = await this.usersService.logout(headers.split(' ')[1]);

    return {
      message: msgLogout.tokenExpire,
      tokenExpires: msgLogout.tokenExpire,
    };
  }

  @Post('forgot_password')
  async forgot_password(
    @Body('reset') reset: ResetDto,
  ): Promise<{ message: string }> {
    const newReset = await this.resetsService.createReset(reset);
    const url = 'http://localhost:3000/api/auth/reset/' + newReset.token;
    this.mailerService
      .sendMail({
        to: newReset.email, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: ` <a href="${url}" target="_blank">Reset Password</a>`, // HTML body content
      })
      .then(() => {})
      .catch(() => {});
    return {
      message: 'success',
    };
  }

  @Post('reset/:tok')
  async reset(
    @Param('tok') tok: string,
    @Body('reset') reset: ResetPasswordDto,
  ): Promise<{ message: string }> {
    if (reset.password !== reset.confirmPassword) {
      throw new BadRequestException('Password do not match');
    }
    return await this.resetsService.findResetAndUpdateUser({
      ...reset,
      token: tok,
    });
  }
}
