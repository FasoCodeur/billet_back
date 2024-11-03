import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { PaymentModule } from './payment/payment.module';
import { EmailService } from './email/email.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { TrajetModule } from './trajet/trajet.module';
import { BusModule } from './bus/bus.module';
import { ReservationModule } from './reservation/reservation.module';
import { EquipmentModule } from './equipment/equipment.module';
import { SeatModule } from './seat/seat.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    CompanyModule,
    PaymentModule,
    TrajetModule,
    BusModule,
    ReservationModule,
    EquipmentModule,
    SeatModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
