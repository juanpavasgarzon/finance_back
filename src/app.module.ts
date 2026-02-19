import { Module } from '@nestjs/common';

import { AuthModule } from 'modules/auth/auth.module';
import { CategoriesModule } from 'modules/categories';
import { ExpensesModule } from 'modules/expenses';
import { IncomeModule } from 'modules/income';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { ReportsModule } from 'modules/reports';
import { SchedulesModule } from 'modules/schedules';
import { UsersModule } from 'modules/users';

import { ConfigModule } from './config';
import { DatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ExpensesModule,
    IncomeModule,
    NotificationsModule,
    ReportsModule,
    SchedulesModule,
  ],
})
export class AppModule {}
