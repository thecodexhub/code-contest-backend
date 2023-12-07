import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatasourceModule } from './datasource/datasource.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { DatasourceExceptionFilter } from './datasource/exceptions';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaClient } from '@prisma/client';
import { SnippetModule } from './snippet/snippet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatasourceModule,
    UserModule,
    TerminusModule,
    PrismaClient,
    SnippetModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_FILTER,
      useClass: DatasourceExceptionFilter,
    },
  ],
  controllers: [HealthController],
})
export class AppModule {}
