import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, concatMap } from 'rxjs';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { Response } from 'express';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Promise<Observable<User>> {
    return next.handle().pipe(
      concatMap(async (user) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        const token = await this.authService.signToken(user);
        response.setHeader('Authorization', `Bearer ${token}`);

        return user;
      }),
    );
  }
}
