import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomLogger } from '../../common/logging/logger.service'; '../logging/logger.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: CustomLogger;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
  ) {
    this.logger = new CustomLogger(winstonLogger);
    this.logger.setContext('HttpExceptionFilter');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string | string[] = 'Internal server error';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      if (typeof errorResponse === 'string') {
        errorMessage = errorResponse;
      } else if (typeof errorResponse === 'object') {
        const errorObj = errorResponse as any;
        errorMessage = errorObj.message || errorMessage;
        errorType = errorObj.error || errorType;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      errorType = exception.name;
    }

    const errorResponse = {
      statusCode: status,
      message: errorMessage,
      error: errorType,
      timestamp,
      path: request.url,
    };

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status} - ${errorType} - RequestId: ${request.headers['x-request-id']} - Body: ${JSON.stringify(request.body)} - Params: ${JSON.stringify(request.params)} - Query: ${JSON.stringify(request.query)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status} - ${errorType} - RequestId: ${request.headers['x-request-id']} - Body: ${JSON.stringify(request.body)} - Params: ${JSON.stringify(request.params)} - Query: ${JSON.stringify(request.query)}`,
      );
    }

    response.status(status).json(errorResponse);
  }
} 