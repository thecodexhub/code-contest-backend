import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatasourceService } from '../datasource/datasource.service';
import { User } from '../user/entities/user.entity';
import { Snippet } from '@prisma/client';
import { CreateSnippetDto, UpdateSnippetDto } from './dtos';

@Injectable()
export class SnippetService {
  constructor(private readonly datasource: DatasourceService) {}

  createSnippet(user: User, data: CreateSnippetDto): Promise<Snippet> {
    return this.datasource.snippet.create({
      data: { ...data, userId: user.id },
    });
  }

  fetchAllSnippetsByUserId(userId: string): Promise<Snippet[]> {
    return this.datasource.snippet.findMany({ where: { userId } });
  }

  async fetchSnippetById(snippetId: string): Promise<Snippet> {
    const snippet = await this.datasource.snippet.findUnique({
      where: { id: snippetId },
    });

    if (!snippet) {
      throw new NotFoundException(
        `Couldn't find any snippy with id: ${snippetId}`,
      );
    }

    return snippet;
  }

  async updateSnippet(
    user: User,
    snippetId: string,
    updateData: UpdateSnippetDto,
  ) {
    const snippet = await this.fetchSnippetById(snippetId);

    if (!snippet) {
      throw new NotFoundException(
        `Couldn't find any snippy with id: ${snippetId}`,
      );
    }

    if (snippet.userId !== user.id) {
      throw new ForbiddenException(
        "The snippet doesn't belong to current user!",
      );
    }

    return this.datasource.snippet.update({
      where: { id: snippetId },
      data: { ...updateData },
    });
  }

  async deleteSnippet(user: User, snippetId: string): Promise<Snippet> {
    const snippet = await this.fetchSnippetById(snippetId);

    if (!snippet) {
      throw new NotFoundException(
        `Couldn't find any snippy with id: ${snippetId}`,
      );
    }

    if (snippet.userId !== user.id) {
      throw new ForbiddenException(
        "The snippet doesn't belong to current user!",
      );
    }

    return this.datasource.snippet.delete({ where: { id: snippetId } });
  }
}
