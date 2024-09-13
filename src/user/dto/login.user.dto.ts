import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;
}