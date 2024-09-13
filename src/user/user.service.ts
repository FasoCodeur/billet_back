import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { ForgetPassWordDto } from './dto/forgetPassWord.dto';
import { User } from './entities/user.entity';
import { VerifyCodesEntity } from './entities/verify-codes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerifyCodesEntity)
    private readonly verifyCodeRepository: Repository<VerifyCodesEntity>,
    // private jwtService: JwtService,
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

  async login(createAuthDto: LoginUserDto) {
    return `This action login user`;
  }

  async verifyEmailCode(code: number, email: string) {
    return Promise.resolve(undefined);
  }

  async forgetPassword(forgotPassword: ForgetPassWordDto) {
    return Promise.resolve(undefined);
  }

  async resetPassword(id: string, oldPassword: string, newPassword: string) {
    return Promise.resolve(undefined);
  }

  async refreshToken(user) {
    return Promise.resolve(undefined);
  }
}
