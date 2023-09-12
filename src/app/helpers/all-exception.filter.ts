import { ArgumentsHost, Catch, ConflictException, NotFoundException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Response } from 'express';
import { AppLogger } from '../logging/logging.service';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  constructor(private logger: AppLogger) {}

  catch(exception: Error, host: ArgumentsHost): Error {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (['AuthenticationError', 'ForbiddenError', 'UserInputError'].includes(exception.name)) {
      this.logger.gqlError(exception.name, exception.message, gqlHost.getInfo()?.fieldName);
      return exception;
    }
    if (exception.name === 'MongoServerError' && exception.message.includes('E11000')) {
      const key = exception.message.split('index: ')[1].split('_1')[0];
      const e = new ConflictException('Already existing ressource: "' + key + '"');
      this.logger.gqlError(e.name, e.message, gqlHost.getInfo()?.fieldName);
      return e;
    }
    const mongodbObjectIdError =
      'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';
    if (exception.message === mongodbObjectIdError) {
      this.logger.gqlError('UserInputError', mongodbObjectIdError, gqlHost.getInfo()?.fieldName);
      return exception;
    }
    if (exception instanceof NotFoundException) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      response.status(404).send('Not found :(');
      return exception;
    } else {
      this.logger.error(exception.message, exception.stack, 'ExceptionHandler');
    }
    throw exception;
  }
}
