import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, SigninUserDto } from './dtos';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { User } from '../user/enitities/user.entity';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User): User {
    return user;
  }
}
