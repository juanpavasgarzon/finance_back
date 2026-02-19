import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtConfigModule } from 'modules/auth/jwt-config.module';
import { UsersModule } from 'modules/users';

import { NotificationController } from './controllers/notification.controller';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { NotificationsService } from './services/notifications.service';
import { CreateNotificationUseCase } from './use-cases/create-notification.use-case';
import { ListUnreadNotificationsUseCase } from './use-cases/list-unread-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from './use-cases/mark-all-notifications-as-read.use-case';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), JwtConfigModule, UsersModule],
  controllers: [NotificationController],
  providers: [
    CreateNotificationUseCase,
    ListUnreadNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
    NotificationsGateway,
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
