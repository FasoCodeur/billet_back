import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {

  @IsNotEmpty()
  @ApiProperty({
    description:'company name',
    default:'Bybus company'
  })
  name: string;

  // @IsNotEmpty()
  // @ApiProperty()
  // logo: string;

  @IsNotEmpty()
  @ApiProperty({
    default:'Bamako'
  })
  // @IsString()
   city: string;

  @ApiPropertyOptional({
    default:39.0
  })
  @IsOptional()
  @IsNumber()
  log:number


  @ApiPropertyOptional({
    default:49.0
  })
  @IsOptional()
  lat:number

}
