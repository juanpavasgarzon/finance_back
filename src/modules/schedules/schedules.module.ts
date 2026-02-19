import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpensesModule } from 'modules/expenses';
import { IncomeModule } from 'modules/income';
import { NotificationsModule } from 'modules/notifications';

import { ScheduleController } from './controllers/schedule.controller';
import { Schedule } from './entities/schedule.entity';
import { ScheduleCronService } from './services/schedule-cron.service';
import { ScheduleMutexService } from './services/schedule-mutex.service';
import { CreateScheduleUseCase } from './use-cases/create-schedule.use-case';
import { GenerateScheduleOccurrencesUseCase } from './use-cases/generate-schedule-occurrences.use-case';
import { ListSchedulesUseCase } from './use-cases/list-schedules.use-case';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Schedule]), ExpensesModule, IncomeModule, NotificationsModule],
  controllers: [ScheduleController],
  providers: [CreateScheduleUseCase, GenerateScheduleOccurrencesUseCase, ListSchedulesUseCase, ScheduleCronService, ScheduleMutexService],
  exports: [TypeOrmModule],
})
export class SchedulesModule {}
