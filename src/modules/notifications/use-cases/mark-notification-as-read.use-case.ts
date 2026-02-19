import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from '../entities/notification.entity';

export class MarkNotificationAsReadUseCase {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async execute(notificationId: string, tenantId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, tenantId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.readAt) {
      return;
    }

    notification.readAt = new Date();
    await this.notificationRepository.save(notification);
  }
}
