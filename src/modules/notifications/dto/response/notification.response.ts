import { Notification } from '../../entities/notification.entity';

export class NotificationResponse {
  id: string;
  code: string;
  title: string;
  message: string | null;
  readAt: string | null;
  createdAt: string;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.code = notification.code;
    this.title = notification.title;
    this.message = notification.message;
    this.readAt = notification.readAt ? notification.readAt.toISOString() : null;
    this.createdAt = notification.createdAt.toISOString();
  }
}
