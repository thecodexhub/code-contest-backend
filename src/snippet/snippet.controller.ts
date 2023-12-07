import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSnippetDto, UpdateSnippetDto } from './dtos';
import { Snippet } from '@prisma/client';

@Controller('snippet')
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  createSnippet(
    @CurrentUser() user: User,
    @Body() snippet: CreateSnippetDto,
  ): Promise<Snippet> {
    return this.snippetService.createSnippet(user, snippet);
  }

  @Get(':snippetId')
  @HttpCode(HttpStatus.OK)
  fetchSnippetById(
    @Param('snippetId', new ParseUUIDPipe()) snippetId: string,
  ): Promise<Snippet> {
    return this.snippetService.fetchSnippetById(snippetId);
  }

  @Put(':snippetId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateSnippet(
    @CurrentUser() user: User,
    @Param('snippetId', new ParseUUIDPipe()) snippetId: string,
    @Body() data: UpdateSnippetDto,
  ): Promise<Snippet> {
    return this.snippetService.updateSnippet(user, snippetId, data);
  }

  @Delete(':snippetId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteSnippet(
    @CurrentUser() user: User,
    @Param('snippetId', new ParseUUIDPipe()) snippetId: string,
  ): Promise<Snippet> {
    return this.snippetService.deleteSnippet(user, snippetId);
  }
}
