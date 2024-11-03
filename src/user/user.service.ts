import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Tokens } from './types';


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
    const existingUser = await this.findUserByEmailOrPhone(createUserDto.email, createUserDto.phone);
    if (existingUser) {
      throw new ConflictException('Vous avez deja un compte.')
    }
    createUserDto.password= await bcrypt.hash(createUserDto.password, 12);
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.verificationCodes', 'verificationCodes')
      .where('user.id = :id', { id: id })
      .getOne();
    if (!user)
      throw new NotFoundException('user not found.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, password, phone, country } = updateUserDto;
    const oldUser = await this.findOne(id);
    oldUser.firstName = firstName;
    oldUser.lastName = lastName;
    oldUser.email = email;
    oldUser.phone = phone;
    oldUser.country = country;
    oldUser.password = await bcrypt.hash(password, 12);
      return await this.userRepository.save(oldUser);
  }

  async remove(id: string) {
    return await this.userRepository.softRemove(await this.findOne(id));
  }

  async login(loginUserDto: LoginUserDto,response) {
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
    const payload = { sub: user.id ,email: user.email, phone:user.phone, roles: user.role };
    const tokens = await this.getTokens(payload);
    response.cookie('access_token', tokens.access_token, { httpOnly: true })
    response.cookie('refresh_token', tokens.refresh_token, { httpOnly: true })
    return tokens;
  }

  async getTokens(payload): Promise<Tokens> {
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

  async refreshToken(refreshToken, response) {
    const userVerify = this.jwtService.verify(refreshToken, {secret: process.env.REFRESH_SECRET });
    const user = await this.findUserByEmailOrPhone(userVerify.email, userVerify.phone);
    if (!user) {
      throw new BadRequestException("Utilisateur n'existe pas");
    }
    const payload = { sub: user.id ,email: user.email, phone:user.phone, roles: user.role };
    const tokens = await this.getTokens(payload);
    response.cookie('access_token', tokens.access_token, { httpOnly: true });
    response.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
    return tokens;
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

  async findUserByEmail(email: string) {
    return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.verificationCodes', 'verificationCodes')
      .where('user.email = :email', { email: email })
      .getOne();
  }

  async findUserByEmailOrPhone(email: string, phone: string) {
    return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.verificationCodes', 'verificationCodes')
      .where('user.email = :email', { email: email })
      .orWhere('user.phone = :phone', { phone: phone })
      .getOne();
  }

  async findUserByPhone(phone: string) {
    return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.verificationCodes', 'verificationCodes')
      .where('user.phone = :phone', { phone: phone })
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
