import { Module } from '@nestjs/common';
import { AuthController } from '@controllers/auth.controller';
import { AppService } from '@app/app.service';
import { UsersService } from '@services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '@repositories/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from '@middlewares/auth.strategy';
import { JwtStrategy } from '@middlewares/jwt.strategy';
import { ResetsRepository } from '@repositories/resets.repository';
import { ResetsService } from '@services/resets.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TemplateAdapter } from '@nestjs-modules/mailer/dist/interfaces/template-adapter.interface';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.jwt_secret,
      verifyOptions: { ignoreExpiration: false },
      signOptions: {
        algorithm: 'HS256',
      },
    }),
    TypeOrmModule.forFeature([UsersRepository, ResetsRepository]),
    MailerModule.forRoot({
      defaults: { from: 'no-replay@localhost.com' },
      transport: { host: 'localhost', port: 1025 },
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, JwtStrategy, AuthStrategy, ResetsService],
  exports: [UsersService, JwtModule, AuthStrategy, ResetsService],
})
export class AuthModule {}
