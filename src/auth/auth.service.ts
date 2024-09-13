import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ForgetPassWordDto } from '../user/dto/forgetPassWord.dto';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { UserService } from '../user/user.service';
import { generateExpiryTime, generateRandomNumber } from '../utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    // private readonly mailService: MailerService,
    // private readonly sendGridService: SendgridService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    return await this.userService.create(createAuthDto);
  }
  async login(createAuthDto: LoginUserDto) {
    return await this.userService.login(createAuthDto)
  }

  async verifyEmailWithMakingEmailVerified(code: number, email: string) {
    return await this.userService.verifyEmailCode(code, email);
  }

  async sendEmailCode(email: string) {
    const verifyEmail = await this.userService.findUserByEmail(email);
    if (!verifyEmail){
      throw  new NotFoundException('Cet email n\'existe pas veuillez creer un compte pour pouvoir envoyer un code de verification.')
    }
    try {
      const emailVerificationCode = generateRandomNumber();
      const emailVerificationCodeExpiry = generateExpiryTime();
      await this.userService.createEmailVerificationCode(
        {
          emailVerificationCode: emailVerificationCode,
          emailVerificationCodeExpiry: emailVerificationCodeExpiry,
        },
        email
      );
      const subject= 'Code de Verification';
      const message = `Votre code verification est: ${emailVerificationCode}`;
    //
    //   // this.sendMail(email, message, subject)
    //   await this.sendGridService.send(email, message, subject);
    //   return {
    //     status: HttpStatus.OK,
    //     message: 'Verification code sent successfully',
    //   };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to send verification code this email dont exit in our database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgetPassword(forgotPassword: ForgetPassWordDto) {
    return await this.userService.forgetPassword(forgotPassword);
  }

  async resetPassword(id: string, oldPassword: string, newPassword: string) {
    return await this.userService.resetPassword(id, oldPassword, newPassword);
  }

  async refresh(user) {
    return await this.userService.refreshToken(user)
  }


}
