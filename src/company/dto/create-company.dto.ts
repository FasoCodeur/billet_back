import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'company ice',
    default: '6523923459875',
  })
  ice: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'company name',
    default: 'Bybus company',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'company email',
    default: 'company@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'company phone number',
    default: '+22377245689',
  })
  phone: string;

  // @IsNotEmpty()
  // @ApiProperty()
  // logo: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'Bamako',
  })
  city: string;
}
