import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto, SigninUserDto } from './dtos';
import { UserService } from '../user/user.service';
import { User } from '../user/enitities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const userEntity = new User(dto);
    await userEntity.hashPassword();

    const user = await this.userService.create(userEntity);
    return user;
  }

  async signin(dto: SigninUserDto) {
    let user: User;

    if (dto.email && dto.email.length > 0) {
      user = await this.userService.findUnique({
        where: { email: dto.email },
      });
    }

    if (dto.username && dto.username.length > 0) {
      user = await this.userService.findUnique({
        where: { username: dto.username },
      });
    }

    if (!user) {
      throw new NotFoundException('Wrong Credentials!');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'The user is not active. Please contact support.',
      );
    }

    if (!(await user.checkPassword(dto.password))) {
      throw new NotFoundException('Wrong Credentials!');
    }

    // TODO: Update last login using message broker
    user = await this.userService.updateLastLogin(user.id);

    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findUnique({
      where: { username: payload.sub },
    });

    if (!user) {
      throw new NotFoundException('Wrong Credentials!');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'The user is not active. Please contact support.',
      );
    }

    return user;
  }

  signToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.username,
    };

    return this.jwtService.signAsync(payload);
  }
}
