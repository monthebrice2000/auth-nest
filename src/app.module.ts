import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configs_mysql } from '@configs/configs_mysql';
import { JwtStrategy } from '@middlewares/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from '@middlewares/auth.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.jwt_secret,
      verifyOptions: { ignoreExpiration: false },
      signOptions: {
        algorithm: 'HS256',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.MODE}`],
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...configs_mysql(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
