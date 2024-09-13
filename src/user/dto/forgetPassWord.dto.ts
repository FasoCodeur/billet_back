import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPassWordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true, })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ required: true, example:3850 })
  @IsNotEmpty()
  emailVerificationCode: string;

  updatedAt: Date;
}