import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { ForgetPassWordDto } from './dto/forgetPassWord.dto';
import { User } from './entities/user.entity';
import { VerifyCodesEntity } from './entities/verify-codes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isExpired } from '../utils/utils';
import * as bcrypt from 'bcrypt';
import * as process from 'node:process';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerifyCodesEntity)
    private readonly verifyCodeRepository: Repository<VerifyCodesEntity>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email or user.password = :password ', { email, password })
      .getOne();

    if (!user) {
      throw new NotFoundException("User is not find");
    }else if ( !user.is_email_verified ){
      throw new BadRequestException({
        status: 400,
        errorMessage:"isVerified",
        message: 'Cet e-mail n\'a pas été vérifié.'
      });
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new NotFoundException("User password is not correct");
    }
    const payload = { sub: user.id ,email: user.email, roles: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn:'1d',
        secret:process.env.JWT_SECRET
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn:'5d',
        secret:process.env.REFRESH_SECRET
      })
    };
  }

  async forgetPassword(forgetPassWordDto: ForgetPassWordDto) {
    const {newPassword, emailVerificationCode, email,updatedAt} = forgetPassWordDto;

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException("Utilisateur n'exite pas.");
    }

    if (!user.verificationCodes) {
      throw new BadRequestException("Cet utilisateur ne dispose pas d\'un code verification, veuillez demamder un autre.");
    }
    const verificationCode = await this.verifyCodeRepository.findOne({ where: { id: user.verificationCodes.id} });
    console.log(verificationCode);
    if (verificationCode.emailVerificationCode && verificationCode.emailVerificationCode == parseInt(emailVerificationCode) ) {
      if (!isExpired(verificationCode.emailVerificationCodeExpiry) && user.is_email_verified == true) {
        user.password = await bcrypt.hash(newPassword, 12);
        user.updatedAt =updatedAt;
        user.verificationCodes = null
        await this.userRepository.save(user);
        await this.verifyCodeRepository.remove(verificationCode)
        return { message: 'Password reset successfully' };
      }else {
        throw new BadRequestException("Veuillez demander un nouveau code de vérification, celui-ci est déjà expiré.")
      }
    }
    else {
      throw new BadRequestException('votre code de verification est incorrecte')
    }
  }

  async resetPassword(id: string, oldPassword: string, newPassword: string) {
    return Promise.resolve(undefined);
  }

  async refreshToken(user) {
    return Promise.resolve(undefined);
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.verificationCodes', 'verificationCodes')
      .where('user.email = :email', { email: email })
      .getOne();
  }

  async createEmailVerificationCode(param: {
    emailVerificationCode: number;
    emailVerificationCodeExpiry: Date
  }, email: string) {
    const user = await this.findUserByEmail(email);
    if (user.verificationCodes) {
      const verificationCodes =
        await this.verifyCodeRepository.findOne({
          where: { id: user.verificationCodes.id },
        });
      await this.verifyCodeRepository.remove(verificationCodes);
    }
    const verificationCode = new VerifyCodesEntity();
    verificationCode.emailVerificationCode = param.emailVerificationCode;
    verificationCode.emailVerificationCodeExpiry = param.emailVerificationCodeExpiry;
    verificationCode.user = user;
    await this.verifyCodeRepository.save(verificationCode);
    return {
      status: HttpStatus.OK,
      message: 'Verification code created or updated successfully',
    };
  }

  async verifyEmailCode(code: number, email: string) {
    const user = await this.findUserByEmail(email);

    if (user.verificationCodes === null) {
      throw new BadRequestException("Pour poursuivre, veuillez demander un code de vérification, car celui-ci n'a pas été généré pour cet utilisateur.")
    }
    const verificationCode = await this.verifyCodeRepository.findOne({ where: { id: user.verificationCodes.id } });
    if (verificationCode.emailVerificationCode && verificationCode.emailVerificationCode == code) {
      if (!isExpired(verificationCode.emailVerificationCodeExpiry)) {
        user.is_email_verified = true;
        user.verificationCodes = null
        await this.userRepository.save(user);
        await this.verifyCodeRepository.remove(verificationCode)
        return {
          status: HttpStatus.OK,
          message: 'Email verified successfully',
        };
      } else {
        throw new HttpException('Code a expiré', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Code de vérification érroné', HttpStatus.BAD_REQUEST);
    }
  }
}
