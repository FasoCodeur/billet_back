import { Body, Controller, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { ForgetPassWordDto } from '../user/dto/forgetPassWord.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Public()
  @Post("/register")
  async register(@Body() createAuthDto: CreateUserDto) {
    return await this.authService.create(createAuthDto);
  }
  // @Public()
  @Post("/login")
  async login(@Body() createAuthDto: LoginUserDto) {
    return await this.authService.login(createAuthDto);
  }

  // @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // response.clearCookie('access_token');
    // response.clearCookie('refresh_token');
    // return {
    //   status: HttpStatus.OK,
    //   message: "Successfully logged out"
    // }
  }

  @Post('refresh')
  @ApiBearerAuth()
  async refresh(@Req() req) {
    const [type, token] = req.headers['authorization']?.split(' ') || [];
    return await this.authService.refresh(token);
  }

  // @Public()
  @ApiBody({
    required: true,
    schema: {
      properties: {
        email: { type: 'string' }
      },
    },
  })
  @Post('/sendEmailCode')
  async sendEmailCode(@Body('email') email: string) {
    return await this.authService.sendEmailCode(email);
  }

  // @Public()
  @Post('verifyEmailCode')
  @ApiBody({
    required: true,
    schema: {
      properties: {
        email: { type: 'string' },
        code: { type: 'number' },
      },
    },
  })
  async verifyEmailCode(@Body('email') email: string, @Body('code') code:number) {
    return await this.authService.verifyEmailWithMakingEmailVerified(code, email)
  }

  // @Public()
  @Patch('forgetPassword')
  async forgetPassword(@Body() forgotPassword: ForgetPassWordDto) {
    return await this.authService.forgetPassword(forgotPassword);
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Public()
  @Patch('resetPassword/:id/:oldPassword/:newPassword')
  async resetPassword(@Param('id') id: string, @Param('oldPassword') oldPassword: string, @Param('newPassword') newPassword: string) {
    return await this.authService.resetPassword(id, oldPassword,newPassword);
  }
}
