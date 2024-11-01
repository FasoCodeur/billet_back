import { Injectable } from '@nestjs/common';
import { CreateTrajetDto } from './dto/create-trajet.dto';
import { UpdateTrajetDto } from './dto/update-trajet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trajet } from './entities/trajet.entity';
import { CompanyService } from '../company/company.service';
import { BusService } from '../bus/bus.service';

@Injectable()
export class TrajetService {
  constructor(
    private readonly busService: BusService,
    private readonly companyService: CompanyService,
    @InjectRepository(Trajet)
    private readonly trajectRepository:Repository<Trajet>
  ) {}

  create(createTrajetDto: CreateTrajetDto) {
    return 'This action adds a new trajet';
  }

  findAll() {
    return `This action returns all trajet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trajet`;
  }

  update(id: number, updateTrajetDto: UpdateTrajetDto) {
    return `This action updates a #${id} trajet`;
  }

  remove(id: number) {
    return `This action removes a #${id} trajet`;
  }
}
