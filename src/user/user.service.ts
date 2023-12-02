import { Injectable } from '@nestjs/common';
import { DatasourceService } from '../datasource/datasource.service';
import { User as UserEntity } from './enitities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly datasource: DatasourceService) {}

  async create(userToCreate: UserEntity): Promise<UserEntity> {
    const user = await this.datasource.user.create({
      data: userToCreate,
    });
    return new UserEntity(user);
  }

  async findUnique(
    where: Prisma.UserFindUniqueArgs,
  ): Promise<UserEntity> | null {
    const user = await this.datasource.user.findUnique(where);
    if (user) {
      return new UserEntity(user);
    }
    return null;
  }

  async updateLastLogin(id: string): Promise<UserEntity> {
    const user = await this.datasource.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
    return new UserEntity(user);
  }
}
