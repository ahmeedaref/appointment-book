import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema, Auth } from './schema/schema-Auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { Auth_Repo } from './Auth-Repo';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.modelName, schema: AuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESSTOKEN'),
        expiresIn: configService.get<string>('EXPIRESIN'),
      }),
    }),
  ],
  providers: [AuthService, Auth_Repo],
  controllers: [AuthController],
  exports: [AuthService, Auth_Repo],
})
export class AuthModule {}
