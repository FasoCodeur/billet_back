import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTrajetDto {

  @ApiProperty({default: 'Gare de Bamako aci'})
  @IsNotEmpty()
  startingPoint:string;

  @ApiProperty({default: 'Gare de Sikasso centre'})
  @IsNotEmpty()
  arrivalPoint:string;

  @ApiProperty({default: '01/01/2024 22h:30'})
  @IsNotEmpty()
  departureDate:string;

  @ApiProperty({default: '02/01/2024 07h:30'})
  @IsNotEmpty()
  arrivalDate:string

  @ApiProperty({default: 2000})
  @IsNotEmpty()
  price: number;

  @ApiProperty({default: 25})
  @IsNotEmpty()
  numberofplacesonsale:number;

  @ApiProperty({default: 'cc3104dc-75ae-4f64-a185-0b55952f3da9'})
  @IsNotEmpty()
  companyUuid: string;

  @ApiPropertyOptional({default: 'cc3104dc-75ae-4f64-a185-0b55952f3da9'})
  @IsOptional()
  busUid:string;



}
