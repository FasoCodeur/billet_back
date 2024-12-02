import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TrajetService } from './trajet.service';
import { CreateTrajetDto } from './dto/create-trajet.dto';
import { UpdateTrajetDto } from './dto/update-trajet.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginateRoute } from './dto/paginate.dto';
import { Public } from '../auth/decorator/roles.decorator';
import { PaginateAdminDto } from './dto/PaginateAdmin.Dto';

@ApiTags('Trajet')
@Controller('trajet')
@ApiBearerAuth()
export class TrajetController {
  constructor(private readonly trajetService: TrajetService) {}

  @Post()
  create(@Body() createTrajetDto: CreateTrajetDto) {
    return this.trajetService.create(createTrajetDto);
  }

  @ApiOperation({ summary: 'For mobile app link public' })
  @Public()
  @Get()
  async findAll(@Query() params: PaginateRoute) {
    const [routes, total, totalPages, currentPage] =
      await this.trajetService.findAll(params);
    return {
      routes,
      current_page: currentPage,
      total_pages: totalPages,
      total_results: total,
    };
  }
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trajetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrajetDto: UpdateTrajetDto) {
    return this.trajetService.update(id, updateTrajetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trajetService.remove(id);
  }

  @Patch('deactivateOrActivate/:id')
  deactivateRoute(@Param('id', ParseUUIDPipe) id: string) {
    return this.trajetService.deactivateRoute(id);
  }

  @Public()
  @Get('/get_all/trajets')
  async get_all_trajets(@Query() params: PaginateAdminDto) {
    const [routes, total, totalPages, currentPage] =
      await this.trajetService.get_all_trajets(params);
    return {
      routes,
      current_page: currentPage,
      total_pages: totalPages,
      total_results: total,
    };
  }
}
