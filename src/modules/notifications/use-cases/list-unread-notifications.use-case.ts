import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Notification } from '../entities/notification.entity';

export class ListUnreadNotificationsUseCase {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async execute(tenantId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { tenantId, readAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }
}
