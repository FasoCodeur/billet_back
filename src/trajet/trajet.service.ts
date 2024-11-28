import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrajetDto } from './dto/create-trajet.dto';
import { UpdateTrajetDto } from './dto/update-trajet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trajet } from './entities/trajet.entity';
import { CompanyService } from '../company/company.service';
import { BusService } from '../bus/bus.service';
import { PaginateRoute } from './dto/paginate.dto';

@Injectable()
export class TrajetService {
  constructor(
    private readonly busService: BusService,
    private readonly companyService: CompanyService,
    @InjectRepository(Trajet)
    private readonly trajectRepository: Repository<Trajet>,
  ) {}

  async create(createTrajetDto: CreateTrajetDto) {
    //Verify if same company route exist
    if (await this.verifyIfRouteExist(createTrajetDto))
      throw new HttpException(
        'This route is already exists',
        HttpStatus.CONFLICT,
      );

    //create a new trajet
    const createTrajet = await this.trajectRepository.create(createTrajetDto);

    //verify if company exist in db
    const company = await this.companyService.findOne(
      createTrajetDto.companyUuid,
    );

    //assign company to traject
    createTrajet.companyUuid = company.id.toString();

    //Verify if bus uuid is define
    if (createTrajetDto.busUid)
      createTrajet.bus = await this.busService.findOne(createTrajetDto.busUid);

    //Create traject
    return await this.trajectRepository.save(createTrajet);
  }

  async findAll(params: PaginateRoute) {
    const {
      page,
      limit,
      startingPoint,
      arrivalPoint,
      numberofplacesonsale,
      maxPrice,
    } = params;
    const pagination: PaginateRoute = {
      maxPrice: 0,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    const skip = (pagination.page - 1) * pagination.limit;
    let query = await this.trajectRepository
      .createQueryBuilder('trajet')
      .leftJoinAndSelect('trajet.bus', 'bus')
      .leftJoinAndSelect('bus.company', 'company')
      .where('trajet.active = :active', { active: true });

    // Filtrer par points de départ et d'arrivée
    if (startingPoint) {
      query = query.andWhere('trajet.startingPoint ILIKE :startingPoint', {
        startingPoint: `%${startingPoint}%`,
      });
    }

    if (arrivalPoint) {
      query = query.andWhere('trajet.arrivalPoint ILIKE :arrivalPoint', {
        arrivalPoint: `%${arrivalPoint}%`,
      });
    }

    //filter by number of seat
    if (numberofplacesonsale)
      query = query.andWhere(
        'trajet.numberofplacesonsale >= :numberofplacesonsale',
        { numberofplacesonsale },
      );

    //filter by budget
    if (maxPrice)
      query = query.andWhere('trajet.price <= :maxPrice', { maxPrice });

    // Filtrer par date de départ
    // if (departureDate) {
    //   query = query.andWhere('trajet.departureDate = :departureDate', {
    //     departureDate,
    //   });
    // }

    // Filtrer par plage horaire de départ
    //     if (timeRange) {
    //       if (timeRange === 'morning') {
    //         query = query.andWhere('EXTRACT(HOUR FROM trajet.departureDate) BETWEEN 0 AND 11');
    //       } else if (timeRange === 'afternoon') {
    //         query = query.andWhere('EXTRACT(HOUR FROM trajet.departureDate) BETWEEN 12 AND 16');
    //       } else if (timeRange === 'evening') {
    //         query = query.andWhere('EXTRACT(HOUR FROM trajet.departureDate) BETWEEN 17 AND 23');
    //       }
    //     }

    // Filtrer par équipement
    // if (equipment) {
    //   query = query.andWhere('trajet.equipment ILIKE :equipment', {
    //     equipment: `%${equipment}%`,
    //   });
    // }

    const [routes, total] = await query
      .orderBy('company.name', 'DESC')
      .skip(skip)
      .take(pagination.limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / pagination.limit);
    return [routes, total, totalPages, pagination.page];
  }

  async findOne(id: string) {
    const trajet = await this.trajectRepository
      .createQueryBuilder('trajet')
      .where('trajet.id = :id', { id: id })
      .leftJoinAndSelect('trajet.bus', 'bus')
      .leftJoinAndSelect('bus.company', 'company')
      .getOne();

    if (!trajet) throw new NotFoundException('Trajet not found.');

    return trajet;
  }

  async update(id: string, updateTrajetDto: UpdateTrajetDto) {
    const {
      arrivalPoint,
      arrivalDate,
      departureDate,
      startingPoint,
      numberofplacesonsale,
      companyUuid,
      price,
      busUid,
    } = updateTrajetDto;

    //Verify if route exist
    const trajet = await this.findOne(id);

    //verify if company exist in db
    if (updateTrajetDto.companyUuid) {
      const company = await this.companyService.findOne(companyUuid);
      trajet.companyUuid = company.id.toString();
    }

    //Verify if bus uuid is define
    if (updateTrajetDto.busUid)
      trajet.bus = await this.busService.findOne(busUid);

    //Mapping old to new traject
    trajet.departureDate = departureDate;
    trajet.arrivalDate = arrivalDate;
    trajet.startingPoint = startingPoint;
    trajet.arrivalPoint = arrivalPoint;
    trajet.numberofplacesonsale = numberofplacesonsale;
    trajet.price = price;

    //save the new traject
    return await this.trajectRepository.save(trajet);
  }

  remove(id: string) {
    return this.trajectRepository.delete(id);
  }
  async verifyIfRouteExist(createTrajetDto: CreateTrajetDto) {
    const {
      busUid,
      companyUuid,
      arrivalPoint,
      arrivalDate,
      departureDate,
      startingPoint,
      numberofplacesonsale,
      price,
    } = createTrajetDto;
    const searchParams = {
      busId: busUid,
      companyUuid,
      arrivalPoint,
      departureDate,
      arrivalDate,
      startingPoint,
      numberofplacesonsale,
      price,
    };

    return await this.trajectRepository
      .createQueryBuilder('trajet')
      .where(
        'trajet.busId = :busId AND trajet.companyUuid = :companyUuid ' +
          'AND trajet.arrivalPoint = :arrivalPoint AND trajet.departureDate = :departureDate ' +
          'AND trajet.arrivalDate = :arrivalDate AND trajet.startingPoint = :startingPoint ' +
          'AND trajet.numberofplacesonsale = :numberofplacesonsale AND trajet.price = :price',
        searchParams,
      )
      .getOne();
  }

  async deactivateRoute(id: string) {
    const route = await this.findOne(id);

    // Inverser l'état de la route
    route.active = !route.active;

    // Sauvegarder les modifications dans la base de données
    await this.trajectRepository.save(route);

    // Retourner un message indiquant le nouvel état de la route
    return {
      message: route.active
        ? 'Route has been activated.'
        : 'Route has been deactivated.',
    };
  }
}
