import { NextFunction, Request, Response } from 'express';
import { Logger } from '../logger';
import env from '../env';

/**
 * Error Middleware
 * @returns express.Response
 */
export default function errorMiddleware() {
  return (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    const internalServerErrorMessage = 'Erro interno no servidor';

    if (!error) {
      next();
    }

    const { stack } = error as { stack?: string };

    if (env.NODE_ENV === 'development' && !!stack) {
      Logger.debug('STACK', stack);
    }

    if (error instanceof Error) {
      const { sqlMessage } = (<unknown>error) as Record<string, string>;

      if (sqlMessage) {
        Logger.error(sqlMessage);
        return res
          .status(500)
          .type('application/json')
          .send({ message: internalServerErrorMessage });
      }

      if ('httpStatus' in error && typeof error.httpStatus === 'number') {
        const { httpStatus, message } = error;

        if (
          'critical' in error &&
          'origin' in error &&
          error.critical &&
          typeof error.origin === 'string'
        ) {
          Logger.criticalError(error.origin, error.message);
        } else {
          Logger.error(message);
        }

        return res
          .status(httpStatus)
          .type('application/json')
          .send({ message });
      }

      Logger.error(error.message);

      return res
        .status(500)
        .type('application/json')
        .send({ message: internalServerErrorMessage });
    }

    return res
      .status(500)
      .type('application/json')
      .send({ message: internalServerErrorMessage });
  };
}
