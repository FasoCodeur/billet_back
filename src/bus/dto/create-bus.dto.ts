import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusDto {

  @IsNotEmpty()
  @ApiProperty({
    default:'54367AC'
  })
  matriculation:string

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    default:25
  })
  numberOfSeats:number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default:'Mini Bus'
  })
  typeOfBus:string

  @IsNotEmpty()
  @ApiProperty({
    default:'cc3104dc-75ae-4f64-a185-0b55952f3da9'
  })
  companyUuid:string

}
