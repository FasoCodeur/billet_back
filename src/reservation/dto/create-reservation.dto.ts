import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsOptional()
  customerName: string;

  @ApiProperty()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  seatNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  reservationDate: Date;

}
