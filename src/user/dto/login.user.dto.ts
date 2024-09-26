import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

  @IsEmail({}, {message:'INVALID_EMAIL_FORMAT'})
  @ApiProperty()
  email: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  password: string;
}