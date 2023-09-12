import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UserInputError } from 'apollo-server-express';
import { AllExceptionsFilter } from './app/helpers/all-exception.filter';
import { AppLogger } from './app/logging/logging.service';

export async function addGlobalProviders(app: NestExpressApplication): Promise<void> {
  /* ============= FILTER ============= */
  app.useGlobalFilters(new AllExceptionsFilter(await app.resolve(AppLogger)));

  /* ============= PIPES ============= */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const explain = errors
          .map((e) => {
            if (!e.constraints) {
              return '';
            }
            return Object.keys(<Record<string, string>>e.constraints)
              .map((key) => {
                return key + ':' + (<Record<string, string>>e.constraints)[key];
              })
              .join(',');
          })
          .join('\n');
        return new UserInputError('VALIDATION_ERROR => ' + explain, {
          invalidArgs: errors,
        });
        return errors;
      },
    }),
  );
}
