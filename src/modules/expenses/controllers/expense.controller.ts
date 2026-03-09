import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { CurrentTenantId } from 'shared';

import { ExpenseCreateRequest } from '../dto/request/expense-create.request';
import { ExpenseResponse } from '../dto/response/expense.response';
import { CreateExpenseUseCase } from '../use-cases/create-expense.use-case';
import { DeleteExpenseUseCase } from '../use-cases/delete-expense.use-case';
import { GetExpenseByIdUseCase } from '../use-cases/get-expense-by-id.use-case';
import { ListExpensesUseCase } from '../use-cases/list-expenses.use-case';
import { MarkExpenseAsPaidUseCase } from '../use-cases/mark-expense-as-paid.use-case';

@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
    private readonly getExpenseByIdUseCase: GetExpenseByIdUseCase,
    private readonly listExpensesUseCase: ListExpensesUseCase,
    private readonly markExpenseAsPaidUseCase: MarkExpenseAsPaidUseCase,
  ) {}

  @Post()
  async create(@CurrentTenantId() tenantId: string, @Body() request: ExpenseCreateRequest): Promise<ExpenseResponse> {
    const expense = await this.createExpenseUseCase.execute({
      tenantId,
      categoryId: request.categoryId,
      name: request.name,
      amount: String(request.amount),
      description: request.description,
      dueDate: request.dueDate ? new Date(request.dueDate) : undefined,
      scheduleId: request.scheduleId,
    });
    return new ExpenseResponse(expense);
  }

  @Get()
  async list(@CurrentTenantId() tenantId: string): Promise<ExpenseResponse[]> {
    const expenses = await this.listExpensesUseCase.execute(tenantId);
    return expenses.map((expense) => new ExpenseResponse(expense));
  }

  @Get(':expenseId')
  async getById(@CurrentTenantId() tenantId: string, @Param('expenseId') expenseId: string): Promise<ExpenseResponse> {
    const expense = await this.getExpenseByIdUseCase.execute(expenseId, tenantId);
    return new ExpenseResponse(expense);
  }

  @Patch(':expenseId/paid')
  async markAsPaid(@CurrentTenantId() tenantId: string, @Param('expenseId') expenseId: string): Promise<ExpenseResponse> {
    const expense = await this.markExpenseAsPaidUseCase.execute(expenseId, tenantId);
    return new ExpenseResponse(expense);
  }

  @Delete(':expenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentTenantId() tenantId: string, @Param('expenseId') expenseId: string): Promise<void> {
    await this.deleteExpenseUseCase.execute(tenantId, expenseId);
  }
}
