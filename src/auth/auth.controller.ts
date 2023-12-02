import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, SigninUserDto } from './dtos';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { User } from '../user/enitities/user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  signin(@Body() body: SigninUserDto): Promise<User> {
    return this.authService.signin(body);
  }
}
