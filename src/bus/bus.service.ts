import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { PaginateRequest } from './dto/paginate.dto';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
    private companyService: CompanyService,
  ) {}


  async create(createBusDto: CreateBusDto) {
    const { matriculation, companyUuid} = createBusDto;
    //Verify if the bus is already exists
    const existingBus = await this.findBusByMatriculation(companyUuid, matriculation);

    //if the bus is already exists throw exception
    if (existingBus) {
      throw new UnauthorizedException(" This bus already exists.");
    }
    const createdBus = await this.busRepository.create(createBusDto);
    createdBus.company =await this.companyService.findOne(companyUuid);
    //save a new bus
    return this.busRepository.save(createdBus);
  }

  async findAll(params:PaginateRequest) {
    const pagination: PaginateRequest = {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 10,
    };
    const skip = (pagination.page - 1) * pagination.limit;
    let query = await this.busRepository
      .createQueryBuilder('bus')
    if (params.matricule) {
      query = query
        .where('bus.matriculation = :matriculation', { matriculation: params.matricule })
    }
    const [bus, total] = await query
      .skip(skip)
      .take(pagination.limit)
      .getManyAndCount();
    const totalPages = Math.ceil(total  / pagination.limit);
    return [bus, total , totalPages, pagination.page];

  }

  async findOne(id: string) {
    const bus = await this.busRepository.createQueryBuilder('bus')
      .where('bus.id = :id', { id: id })
      .getOne();

    if (!bus) {
      throw new NotFoundException("Bus not found.");
    }
    return bus;
  }

  async update(id: string, updateBusDto: UpdateBusDto) {
    const {typeOfBus, companyUuid, matriculation, numberOfSeats} = updateBusDto;
    //find existing us
    const bus = await this.findOne(id);
    //mapped old data and new data
    bus.typeOfBus = typeOfBus;
    bus.matriculation = matriculation;
    bus.numberOfSeats = numberOfSeats
    bus.company = await this.companyService.findOne(companyUuid);
    // save updated bus
    return await this.busRepository.save(bus);
  }

  remove(id: string) {
    return this.busRepository.delete(id);
  }

  async findBusByMatriculation(companyUuid: string, matricule: string) {
    return await this.busRepository.createQueryBuilder('bus')
      .where('bus.companyId = :companyId', { companyId: companyUuid })
      .andWhere('bus.matriculation = :matriculation', { matriculation: matricule })
      .getOne();
  }

}
