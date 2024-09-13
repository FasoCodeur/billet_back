import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     host:variableConfig.SENDER_EMAIL,
    //     auth: {
    //       user: variableConfig.EMAIL_USERNAME,
    //       pass: variableConfig.EMAIL_PASSWORD,
    //     },
    //   },
    // }),
    UserModule,
    // SendgridModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
