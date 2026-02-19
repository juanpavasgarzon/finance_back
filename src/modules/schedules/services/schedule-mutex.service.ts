import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SCHEDULE_ADVISORY_LOCK_KEY } from '../constants/schedule-cron.constants';

@Injectable()
export class ScheduleMutexService {
  constructor(private readonly dataSource: DataSource) {}

  async withLock<T>(fn: () => Promise<T>): Promise<T | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const raw = (await queryRunner.query('SELECT pg_try_advisory_lock($1) AS "pg_try_advisory_lock"', [
        SCHEDULE_ADVISORY_LOCK_KEY,
      ])) as unknown;
      const row = Array.isArray(raw) && raw.length > 0 ? (raw[0] as unknown) : undefined;
      const acquired =
        typeof row === 'object' &&
        row !== null &&
        'pg_try_advisory_lock' in row &&
        (row as { pg_try_advisory_lock: boolean }).pg_try_advisory_lock === true;
      if (!acquired) {
        return null;
      }

      return await fn();
    } finally {
      await queryRunner.query('SELECT pg_advisory_unlock($1)', [SCHEDULE_ADVISORY_LOCK_KEY]);
      await queryRunner.release();
    }
  }
}
