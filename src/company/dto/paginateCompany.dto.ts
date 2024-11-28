import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaginateCompanyDto {
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
    description: 'le nom  de la request',
    example: 'Toure company',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'le status de la request',
    example: true,
    required: false,
  })
  @IsOptional()
  status?: boolean;
}
