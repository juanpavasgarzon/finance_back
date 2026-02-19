import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import { IncomeCreateRequest } from '../dto/request/income-create.request';
import { IncomeResponse } from '../dto/response/income.response';
import { CreateIncomeUseCase } from '../use-cases/create-income.use-case';
import { GetIncomeByIdUseCase } from '../use-cases/get-income-by-id.use-case';
import { ListIncomesUseCase } from '../use-cases/list-incomes.use-case';
import { MarkIncomeAsPaidUseCase } from '../use-cases/mark-income-as-paid.use-case';

@Controller('incomes')
export class IncomeController {
  constructor(
    private readonly createIncomeUseCase: CreateIncomeUseCase,
    private readonly getIncomeByIdUseCase: GetIncomeByIdUseCase,
    private readonly listIncomesUseCase: ListIncomesUseCase,
    private readonly markIncomeAsPaidUseCase: MarkIncomeAsPaidUseCase,
  ) {}

  @Post()
  async create(@CurrentTenantId() tenantId: string, @Body() request: IncomeCreateRequest): Promise<IncomeResponse> {
    const income = await this.createIncomeUseCase.execute({
      tenantId,
      categoryId: request.categoryId,
      amount: String(request.amount),
      currencyCode: request.currencyCode,
      description: request.description,
      dueDate: request.dueDate ? new Date(request.dueDate) : undefined,
      scheduleId: request.scheduleId,
    });
    return new IncomeResponse(income);
  }

  @Get()
  async list(@CurrentTenantId() tenantId: string): Promise<IncomeResponse[]> {
    const incomes = await this.listIncomesUseCase.execute(tenantId);
    return incomes.map((income) => new IncomeResponse(income));
  }

  @Get(':incomeId')
  async getById(@CurrentTenantId() tenantId: string, @Param('incomeId') incomeId: string): Promise<IncomeResponse> {
    const income = await this.getIncomeByIdUseCase.execute(incomeId, tenantId);
    return new IncomeResponse(income);
  }

  @Patch(':incomeId/paid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsPaid(@CurrentTenantId() tenantId: string, @Param('incomeId') incomeId: string): Promise<void> {
    await this.markIncomeAsPaidUseCase.execute(incomeId, tenantId);
  }
}
