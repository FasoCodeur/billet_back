import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Address } from './entities/address.entity';
import { PaginateCompanyDto } from './dto/paginateCompany.dto';

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
      company.ice = createCompanyDto.ice;
      company.phone = createCompanyDto.phone;
      company.email = createCompanyDto.email;
      const address = this.addressRepository.create(createCompanyDto);
      address.company = company;
      return await this.addressRepository.save(address);
    } catch (e) {
      return {
        message: e.message + 'Company name  should be unique',
      };
    }
  }

  async findAll(params: PaginateCompanyDto) {
    const { page, limit, status, name } = params;

    const pagination: PaginateCompanyDto = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    const skip = (page - 1) * limit;

    let query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address');

    if (status) {
      query = query.where('company.isActive = :isActive', { isActive: status });
    }

    if (name) {
      query = query.andWhere('company.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    const [companies, total] = await query
      .skip(skip)
      .take(pagination.limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    return [companies, total, totalPages, page];
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
    const address = await this.addressRepository.findOneBy({
      id: company.address.id,
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    company.name = updateCompanyDto.name;
    address.city = updateCompanyDto.city;
    company.ice = updateCompanyDto.ice;
    company.phone = updateCompanyDto.phone;
    company.email = updateCompanyDto.email;
    await this.addressRepository.save(address);
    await this.companyRepository.save(company);
    return company;
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
    return {
      message: 'Removed company successfully',
    };
  }

  async changeStatus(id: string) {
    //verify if company existe
    const company = await this.findOne(id);
    company.isActive = !company.isActive;

    //save company modification
    await this.companyRepository.save(company);

    // Retourner un message basé sur l'état actuel de 'isActive'
    return {
      message: company.isActive ? 'Company Activated' : 'Company Deactivated',
    };
  }
}
