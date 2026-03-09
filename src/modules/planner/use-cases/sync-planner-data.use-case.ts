import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category, CategoryType } from 'modules/categories';
import { Expense } from 'modules/expenses';
import { Income } from 'modules/income';

import type { SyncPlannerResult } from '../contracts/sync-planner-result.interface';
import { PlannerConfig } from '../entities/planner-config.entity';

interface FixedExpenseShape {
  nombre: string;
  monto: number;
  quincena: string;
}

interface ExtraIncomeShape {
  fecha: string;
  fuente: string;
  monto: number;
}

interface PayrollShape {
  salarioBasico?: number;
  auxilioTransporte?: number;
  montoSalud?: number;
  montoPension?: number;
  montoFSP?: number;
  retencionQuincenal?: number;
  otrosDescuentos?: number;
  enableAuxTransporte?: boolean;
  enableSalud?: boolean;
  enablePension?: boolean;
  enableFSP?: boolean;
}

function calculateNetMonthly(cfg: PayrollShape): number {
  const sal = cfg.salarioBasico ?? 0;
  const aux = cfg.enableAuxTransporte ? (cfg.auxilioTransporte ?? 0) : 0;
  const salud = cfg.enableSalud ? (cfg.montoSalud ?? 0) : 0;
  const pension = cfg.enablePension ? (cfg.montoPension ?? 0) : 0;
  const fsp = cfg.enableFSP ? (cfg.montoFSP ?? 0) : 0;
  const retencion = cfg.retencionQuincenal ?? 0;
  const otros = cfg.otrosDescuentos ?? 0;

  const devQ = sal / 2 + aux / 2;
  const dedQ = salud / 2 + pension / 2 + fsp / 2 + retencion + otros;
  const netoQ = devQ - dedQ;

  return netoQ * 2;
}

@Injectable()
export class SyncPlannerDataUseCase {
  constructor(
    @InjectRepository(PlannerConfig)
    private readonly plannerRepository: Repository<PlannerConfig>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async execute(tenantId: string): Promise<SyncPlannerResult> {
    const planner = await this.plannerRepository.findOne({ where: { tenantId } });

    if (!planner) {
      throw new NotFoundException('Planner config not found');
    }

    let categoriesCreated = 0;
    let expensesCreated = 0;
    let incomesCreated = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const payrollConfig = planner.payrollConfig as unknown as PayrollShape;
    const fixedExpenses = planner.fixedExpenses as unknown as FixedExpenseShape[];
    const extraIncomes = planner.extraIncomes as unknown as ExtraIncomeShape[];

    const netMonthly = calculateNetMonthly(payrollConfig);

    if (netMonthly > 0) {
      const payrollCategory = await this.findOrCreateCategory(tenantId, 'Nómina', 'INCOME');

      if (payrollCategory.isNew) {
        categoriesCreated++;
      }

      const existingSalary = await this.findExistingRecord(
        this.incomeRepository,
        tenantId,
        'Nómina',
        currentMonth,
        currentYear,
      );

      if (!existingSalary) {
        const income = this.incomeRepository.create({
          tenantId,
          categoryId: payrollCategory.id,
          name: 'Nómina',
          amount: netMonthly.toFixed(2),
          paidAt: null,
          dueDate: new Date(currentYear, currentMonth, 15),
          description: null,
        });

        await this.incomeRepository.save(income);
        incomesCreated++;
      }
    }

    for (const expense of fixedExpenses) {
      if (!expense.nombre || !expense.monto || expense.monto <= 0) {
        continue;
      }

      const category = await this.findOrCreateCategory(tenantId, expense.nombre, 'EXPENSE');

      if (category.isNew) {
        categoriesCreated++;
      }

      const existing = await this.findExistingRecord(
        this.expenseRepository,
        tenantId,
        expense.nombre,
        currentMonth,
        currentYear,
      );

      if (!existing) {
        const entity = this.expenseRepository.create({
          tenantId,
          categoryId: category.id,
          name: expense.nombre,
          amount: expense.monto.toFixed(2),
          paidAt: null,
          dueDate: new Date(currentYear, currentMonth, expense.quincena === '1Q' ? 15 : 30),
          description: null,
        });

        await this.expenseRepository.save(entity);
        expensesCreated++;
      }
    }

    for (const extra of extraIncomes) {
      if (!extra.fuente || !extra.monto || extra.monto <= 0) {
        continue;
      }

      const category = await this.findOrCreateCategory(tenantId, 'Ingresos Extra', 'INCOME');

      if (category.isNew) {
        categoriesCreated++;
      }

      const extraDate = extra.fecha ? new Date(extra.fecha) : now;
      const extraMonth = extraDate.getMonth();
      const extraYear = extraDate.getFullYear();

      const existing = await this.findExistingRecord(
        this.incomeRepository,
        tenantId,
        extra.fuente,
        extraMonth,
        extraYear,
      );

      if (!existing) {
        const entity = this.incomeRepository.create({
          tenantId,
          categoryId: category.id,
          name: extra.fuente,
          amount: extra.monto.toFixed(2),
          paidAt: null,
          dueDate: extraDate,
          description: null,
        });

        await this.incomeRepository.save(entity);
        incomesCreated++;
      }
    }

    return { categoriesCreated, expensesCreated, incomesCreated };
  }

  private async findOrCreateCategory(
    tenantId: string,
    name: string,
    type: CategoryType,
  ): Promise<{ id: string; isNew: boolean }> {
    const existing = await this.categoryRepository.findOne({
      where: { tenantId, name, type },
    });

    if (existing) {
      return { id: existing.id, isNew: false };
    }

    const category = this.categoryRepository.create({ tenantId, name, type });
    const saved = await this.categoryRepository.save(category);

    return { id: saved.id, isNew: true };
  }

  private async findExistingRecord(
    repository: Repository<Expense> | Repository<Income>,
    tenantId: string,
    name: string,
    month: number,
    year: number,
  ): Promise<boolean> {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const count = await repository
      .createQueryBuilder('r')
      .where('r.tenantId = :tenantId', { tenantId })
      .andWhere('r.name = :name', { name })
      .andWhere('r.dueDate >= :start', { start: startOfMonth })
      .andWhere('r.dueDate <= :end', { end: endOfMonth })
      .getCount();

    return count > 0;
  }
}
