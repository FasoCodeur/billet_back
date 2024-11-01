import { Module } from '@nestjs/common';
import { TrajetService } from './trajet.service';
import { TrajetController } from './trajet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trajet } from './entities/trajet.entity';
import { CompanyModule } from '../company/company.module';
import { BusModule } from '../bus/bus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trajet]),
    CompanyModule,
    BusModule,
  ],
  controllers: [TrajetController],
  providers: [TrajetService],
})
export class TrajetModule {}
