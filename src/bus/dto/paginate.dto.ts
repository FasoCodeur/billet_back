import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaginateRequest {

  @ApiProperty({ description: 'Page number', example: 1, required: true })
  @IsNotEmpty()
  page?: number;

  @ApiProperty({ description: 'Results per page limit', example: 10, required: true })
  @IsNotEmpty()
  limit?: number;

  @ApiPropertyOptional({ description: 'le status de la request', example:'3445AA' , required: false })
  @IsOptional()
  matricule?: string;
}