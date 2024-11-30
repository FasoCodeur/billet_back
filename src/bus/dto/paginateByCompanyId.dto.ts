import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class PaginateByCompanyIdDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  page?: number;

  @ApiProperty({
    description: 'Results per page limit',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  limit?: number;

  @ApiProperty({
    description: 'le status de la request',
    example: '0b1cdbb6-2a9f-44be-8197-f490fb8e3de0',
    required: true,
  })
  @IsUUID()
  company_id: string;

  @ApiPropertyOptional({
    description: 'le status de la request',
    example: '3445AA',
    required: false,
  })
  @IsOptional()
  matricule?: string;
}
