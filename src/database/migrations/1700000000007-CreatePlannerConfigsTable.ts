import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePlannerConfigsTable1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'planner_configs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'tenant_id', type: 'uuid', isUnique: true },
          { name: 'payrollConfig', type: 'jsonb', default: "'{}'" },
          { name: 'fixedExpenses', type: 'jsonb', default: "'[]'" },
          { name: 'extraIncomes', type: 'jsonb', default: "'[]'" },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'planner_configs',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('planner_configs', true);
  }
}
