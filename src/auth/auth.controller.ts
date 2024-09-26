import { BadRequestException, Body, Controller, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { ForgetPassWordDto } from '../user/dto/forgetPassWord.dto';
import { Response } from 'express'

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
  async login(@Body() createAuthDto: LoginUserDto, @Res({passthrough:true}) response:Response) {
    const tokens = await this.authService.login(createAuthDto, response);
    response.cookie('access_token', tokens.access_token, { httpOnly: true });
    response.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
    return tokens;
  }

  // @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return {
      status: HttpStatus.OK,
      message: "Successfully logged out"
    }
  }

  @Post('refresh')
  @ApiBearerAuth()
  async refresh(@Req() req, @Res({ passthrough: true }) response: Response) {
    const [type, token] = req.headers['authorization']?.split(' ') || [];
    if (type ==='Bearer'){
      const newAccessToken = await this.authService.refresh(token, response);
      response.cookie('access_token', newAccessToken, { httpOnly: true });
      response.cookie('refresh_token', newAccessToken.refresh_token, { httpOnly: true });
      return newAccessToken;
    }else {
      throw new BadRequestException('Ce token est incorrecte.');
    }
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
