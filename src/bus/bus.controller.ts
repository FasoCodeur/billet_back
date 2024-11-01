import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginateRequest } from './dto/paginate.dto';

@ApiTags('CompanyBus')
@Controller('bus')
@ApiBearerAuth()
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post()
  create(@Body() createBusDto: CreateBusDto) {
    return this.busService.create(createBusDto);
  }

  @Get()
  async findAll(@Query() params: PaginateRequest) {
    const [bus, total, totalPages, currentPage] = await this.busService.findAll(params);
    return {
      bus,
      current_page: currentPage,
      total_pages: totalPages,
      total_results: total,
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.busService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBusDto: UpdateBusDto) {
    return this.busService.update(id, updateBusDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.busService.remove(id);
  }
}
