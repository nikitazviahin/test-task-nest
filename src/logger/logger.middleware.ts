import { HttpService } from '@nestjs/axios';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const {} = request;

    response.on('close', () => {
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      const { statusCode } = response;

      const logData = {
        responseTime,
        statusCode,
        request,
        response,
      };

      this.httpService.post('http://localhost:8765/logging', logData);
    });

    next();
  }
}
