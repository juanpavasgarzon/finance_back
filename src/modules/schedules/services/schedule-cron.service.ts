import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ScheduleMutexService } from './schedule-mutex.service';
import { SCHEDULE_CRON_OCCURRENCES } from '../constants/schedule-cron.constants';
import { GenerateScheduleOccurrencesUseCase } from '../use-cases/generate-schedule-occurrences.use-case';

@Injectable()
export class ScheduleCronService {
  private readonly logger = new Logger(ScheduleCronService.name);

  constructor(
    private readonly scheduleMutexService: ScheduleMutexService,
    private readonly generateScheduleOccurrencesUseCase: GenerateScheduleOccurrencesUseCase,
  ) {}

  @Cron(SCHEDULE_CRON_OCCURRENCES, {
    name: 'schedule-occurrences',
  })
  async handleScheduleOccurrences(): Promise<void> {
    const ran = await this.scheduleMutexService.withLock(async () => {
      await this.generateScheduleOccurrencesUseCase.execute(new Date());
    });
    if (ran === null) {
      this.logger.warn('Schedule occurrences job skipped: lock not acquired');
    }
  }
}
