import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe, Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsDto } from './dto/uploads.dto';
import { PaginateCompanyDto } from './dto/paginateCompany.dto';

@ApiTags('Agence de voyage')
@Controller('company')
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get() async findAll(@Query() params: PaginateCompanyDto) {
    const [companies, total, totalPages, currentPage] =
      await this.companyService.findAll(params);
    return {
      companies,
      current_page: currentPage,
      total_pages: totalPages,
      total_results: total,
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Patch('/change_status/:id')
  changeStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.changeStatus(id);
  }

  // @Public()
  @Post('uploadsCompanyImages')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 30))
  async uploads(
    @Body() uploadsDto: UploadsDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    // return await this.companyService.uploads(uploadsDto, images);
    return null;
  }
}
