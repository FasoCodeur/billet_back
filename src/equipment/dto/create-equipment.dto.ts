import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty()
  @IsNotEmpty()
  type: string;
}
