import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import type { CategoryType } from 'modules/categories';
import { Category } from 'modules/categories';
import { User } from 'modules/users';

import type { CurrencyCode } from 'shared/constants/currency.constants';

import type { RecurrenceUnit } from '../contracts/recurrence-unit.types';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  user: User;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'varchar', length: 20 })
  type: CategoryType;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 3 })
  currencyCode: CurrencyCode;

  @Column({ type: 'int' })
  recurrenceInterval: number;

  @Column({ type: 'varchar', length: 10 })
  recurrenceUnit: RecurrenceUnit;

  @Column({ type: 'date' })
  nextDueDate: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
