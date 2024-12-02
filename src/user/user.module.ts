import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { VerifyCodesEntity } from './entities/verify-codes.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, VerifyCodesEntity]),
  ],
  controllers: [UserController],
  providers: [UserService,JwtService],
  exports:[UserService]
})
export class UserModule {}
