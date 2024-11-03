import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({default: 'Toure'})
  @IsNotEmpty()
  firstName: string

  @ApiProperty({default: 'Aboubacar'})
  @IsNotEmpty()
  lastName: string

  @IsEmail({}, {message:'INVALID_EMAIL_FORMAT'})
  @ApiProperty()
  readonly email: string;

  @IsPhoneNumber('ML',{message:'INVALID_PHONE_NUMBER'})
  @ApiProperty()
  phone: string;

  @ApiPropertyOptional({default: 'Mali'})
  @IsOptional()
  country: string

  @ApiProperty({required: true})
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-zA-Z\d]).{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character',
  })
  password: string;

}
