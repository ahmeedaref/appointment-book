import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TimeSlotsController } from './time_slots/time_slots.controller';
import { TimeSlotsService } from './time_slots/time_slots.service';
import { TimeSlotsModule } from './time_slots/time_slots.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return { uri };
      },
    }),
    AuthModule,
    TimeSlotsModule,
  ],
  controllers: [AppController, AuthController, TimeSlotsController],
  providers: [AppService, AuthService, TimeSlotsService],
})
export class AppModule {}
