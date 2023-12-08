import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos';
import { CurrentUser } from './decorators/current-user.decorator';
import { SnippetService } from '../snippet/snippet.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly snippetService: SnippetService,
  ) {}

  @Get('username')
  @HttpCode(HttpStatus.OK)
  async isUsernameAvailable(@Query('username') username: string) {
    const isUsernameAvailable =
      await this.userService.isUsernameAvailable(username);
    return { isUsernameAvailable };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User): User {
    return user;
  }

  @Get('/me/snippets')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  fetchAllSnippetsByMe(@CurrentUser() user: User) {
    return this.snippetService.fetchAllSnippetsByUserId(user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return this.userService.findUnique({ where: { id } });
  }

  @Get('/:id/snippets')
  @HttpCode(HttpStatus.OK)
  fetchAllSnippetsByUserId(@Param('id', new ParseUUIDPipe()) userId: string) {
    return this.snippetService.fetchAllSnippetsByUserId(userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userUpdates: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, userUpdates);
  }
}
