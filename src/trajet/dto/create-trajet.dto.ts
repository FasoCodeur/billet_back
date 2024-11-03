import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { format } from 'date-fns';
import { Transform, Type } from 'class-transformer';

export class CreateTrajetDto {

  @ApiProperty({default: 'Gare de Bamako aci'})
  @IsNotEmpty()
  startingPoint:string;

  @ApiProperty({default: 'Gare de Sikasso centre'})
  @IsNotEmpty()
  arrivalPoint:string;

  @ApiProperty({ default: '2024-01-01T22:30' })
  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd'T'HH:mm"))
  departureDate:Date;

  @ApiProperty({ default: '2024-01-02T07:30' })
  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd'T'HH:mm"))
  arrivalDate:Date

  @ApiProperty({default: 2000})
  @IsNotEmpty()
  price: number;

  @ApiProperty({default: 25})
  @IsNotEmpty()
  @IsNumber()
  numberofplacesonsale:number;

  @ApiProperty({default: 'cc3104dc-75ae-4f64-a185-0b55952f3da9'})
  @IsNotEmpty()
  companyUuid: string;

  @ApiPropertyOptional({default: 'cc3104dc-75ae-4f64-a185-0b55952f3da9'})
  @IsOptional()
  busUid:string;

}
