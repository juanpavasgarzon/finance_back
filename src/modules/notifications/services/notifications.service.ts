import { Injectable } from '@nestjs/common';

import { NOTIFICATION_EVENT } from '../constants/notifications.constants';
import type { NotifyInput } from '../contracts/notify-input.interface';
import { NotificationResponse } from '../dto/response/notification.response';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { CreateNotificationUseCase } from '../use-cases/create-notification.use-case';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async notify(input: NotifyInput): Promise<NotificationResponse> {
    const notification = await this.createNotificationUseCase.execute({
      tenantId: input.tenantId,
      code: input.code,
      title: input.title,
      message: input.message ?? null,
    });

    const payload = new NotificationResponse(notification);
    if (input.emitRealtime) {
      this.notificationsGateway.emitToTenant(input.tenantId, NOTIFICATION_EVENT, payload);
    }

    return payload;
  }
}
