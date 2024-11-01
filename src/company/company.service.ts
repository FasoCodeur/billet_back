import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = new Company();
      company.name = createCompanyDto.name;
      const address = this.addressRepository.create(createCompanyDto);
      address.company = company;
      return await this.addressRepository.save(address);
    }catch (e) {
      return {
        message: e.message + 'Company name  should be unique',
      }
    }

  }

  async findAll() {
    return await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address')
      .getMany();
  }

  async findOne(id: string) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .where('company.id = :id', { id: id })
      .leftJoinAndSelect('company.address', 'address')
      .getOne();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);
    const address = await this.addressRepository.findOneBy({id: company.address.id})
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    company.name = updateCompanyDto.name;
    address.city = updateCompanyDto.city;
    address.lat = updateCompanyDto.lat;
    address.log = updateCompanyDto.log;
    await this.addressRepository.save(address);
    await this.companyRepository.save(company);
    return company;
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    return this.addressRepository.delete(company);
  }
}
