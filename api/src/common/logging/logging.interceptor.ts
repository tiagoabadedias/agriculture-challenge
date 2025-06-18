import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { CustomLogger } from '../../common/logging/logger.service'; './logger.service';
import { Request, Response } from 'express';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, params, query, headers } = request;
    const startTime = Date.now();

    this.logger.setContext('HTTP');
    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)} - Headers: ${JSON.stringify({
        ...headers,
        authorization: headers.authorization ? '[REDACTED]' : undefined,
      })}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          this.logger.log(
            `Response: ${method} ${url} - Status: ${response.statusCode} - Time: ${responseTime}ms - Data: ${JSON.stringify(data)}`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `Error: ${method} ${url} - Status: ${error.status || 500} - Time: ${responseTime}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
} 