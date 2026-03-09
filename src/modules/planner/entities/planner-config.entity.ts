import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'modules/users';

@Entity('planner_configs')
export class PlannerConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', unique: true })
  tenantId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  user: User;

  @Column({ type: 'jsonb', default: '{}' })
  payrollConfig: Record<string, unknown>;

  @Column({ type: 'jsonb', default: '[]' })
  fixedExpenses: Array<Record<string, unknown>>;

  @Column({ type: 'jsonb', default: '[]' })
  extraIncomes: Array<Record<string, unknown>>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
