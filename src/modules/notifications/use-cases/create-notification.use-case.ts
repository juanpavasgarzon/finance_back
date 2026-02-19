import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateNotificationInput } from '../contracts/create-notification-input.interface';
import { Notification } from '../entities/notification.entity';

export class CreateNotificationUseCase {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    const notification = this.notificationRepository.create({
      tenantId: input.tenantId,
      code: input.code,
      title: input.title,
      message: input.message ?? null,
    });
    return this.notificationRepository.save(notification);
  }
}
