import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Notification } from '../entities/notification.entity';

export class MarkAllNotificationsAsReadUseCase {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async execute(tenantId: string): Promise<void> {
    await this.notificationRepository.update({ tenantId, readAt: IsNull() }, { readAt: new Date() });
  }
}
