import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrajetService } from './trajet.service';
import { CreateTrajetDto } from './dto/create-trajet.dto';
import { UpdateTrajetDto } from './dto/update-trajet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Trajet')
@Controller('trajet')
@ApiBearerAuth()
export class TrajetController {
  constructor(private readonly trajetService: TrajetService) {}

  @Post()
  create(@Body() createTrajetDto: CreateTrajetDto) {
    return this.trajetService.create(createTrajetDto);
  }

  @Get()
  findAll() {
    return this.trajetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trajetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrajetDto: UpdateTrajetDto) {
    return this.trajetService.update(+id, updateTrajetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trajetService.remove(+id);
  }
}
