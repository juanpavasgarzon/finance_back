import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import type { RequestUser } from '../contracts/request-user.interface';

export const CurrentTenantId = createParamDecorator((_data: unknown, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest<Request>();
  const user = request.user as RequestUser;
  return user.tenantId;
});
