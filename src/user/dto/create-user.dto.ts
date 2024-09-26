import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, {message:'INVALID_EMAIL_FORMAT'})
  @ApiProperty()
  readonly email: string;

  @IsPhoneNumber('ML',{message:'INVALID_PHONE_NUMBER'})
  @ApiProperty()
  phone: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-zA-Z\d]).{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character',
  })
  password: string;

}
