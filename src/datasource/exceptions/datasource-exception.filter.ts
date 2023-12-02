import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class DatasourceExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const messageMatchArray = exception.message.match(/Unique.*/g);

        response.status(status).json({
          statusCode: status,
          message: messageMatchArray.length
            ? messageMatchArray[messageMatchArray.length - 1]
            : `Unique constraint failed!`,
        });
        break;
      }
    }
  }
}
