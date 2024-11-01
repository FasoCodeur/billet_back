import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { generateExpiryTime, generateRandomNumber } from '../utils/utils';
import { UserService } from '../user/user.service';

// @Injectable()
export class EmailService {
  constructor(
    private userService: UserService,
    // private readonly mailService: MailerService,
    // private readonly sendGridService: SendgridService,
  ) {}
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

}
