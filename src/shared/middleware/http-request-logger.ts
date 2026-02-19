import { Request, Response, NextFunction } from 'express';

export function httpRequestLogger(request: Request, response: Response, next: NextFunction): void {
  const start = Date.now();

  response.on('finish', () => {
    const duration = Date.now() - start;
    console.info(`${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms - ${request.ip ?? 'unknown'}`);
  });

  next();
}
