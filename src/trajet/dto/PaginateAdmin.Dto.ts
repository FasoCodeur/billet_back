import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaginateAdminDto {
  @ApiProperty({ description: 'Page number', example: 1, required: true })
  @IsNotEmpty()
  page?: number;

  @ApiProperty({
    description: 'Results per page limit',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'sikasso',
    required: false,
  })
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'The start point',
    example: 'sikasso',
    required: false,
  })
  @IsOptional()
  startingPoint?: string;

  @ApiPropertyOptional({
    description: 'The arrival point',
    example: 'bamako',
    required: false,
  })
  @IsOptional()
  arrivalPoint?: string;

  @ApiPropertyOptional({
    description: 'Number of Travellers',
    example: 2,
    required: false,
  })
  @IsOptional()
  numberofplacesonsale?: number;

  @ApiPropertyOptional({ description: 'route price', required: false })
  @IsOptional()
  price: number;
}
