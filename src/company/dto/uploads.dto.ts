import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadsDto {
  @ApiProperty({ type: 'string', isArray: true, format: 'binary', required: false })
  @IsOptional()
  @Type(() => String)
  images: Express.Multer.File[];

  @ApiProperty({
    description: 'add Id',
    example: 'b66d2beb-e5d0-4649-8f72-3b266f55f4f6',
  })
  companyId: string;
}