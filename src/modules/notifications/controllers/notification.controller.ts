import { Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import { NotificationResponse } from '../dto/response/notification.response';
import { ListUnreadNotificationsUseCase } from '../use-cases/list-unread-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../use-cases/mark-all-notifications-as-read.use-case';
import { MarkNotificationAsReadUseCase } from '../use-cases/mark-notification-as-read.use-case';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly listUnreadNotificationsUseCase: ListUnreadNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
  ) {}

  @Get()
  async listUnread(@CurrentTenantId() tenantId: string): Promise<NotificationResponse[]> {
    const notifications = await this.listUnreadNotificationsUseCase.execute(tenantId);
    return notifications.map((n) => new NotificationResponse(n));
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@CurrentTenantId() tenantId: string): Promise<void> {
    await this.markAllNotificationsAsReadUseCase.execute(tenantId);
  }

  @Patch(':notificationId/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(@CurrentTenantId() tenantId: string, @Param('notificationId') notificationId: string): Promise<void> {
    await this.markNotificationAsReadUseCase.execute(notificationId, tenantId);
  }
}
