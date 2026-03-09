import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateIncomesTable1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'incomes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'tenant_id', type: 'uuid' },
          { name: 'categoryId', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '200' },
          { name: 'amount', type: 'decimal', precision: 14, scale: 2 },
          { name: 'paidAt', type: 'timestamptz', isNullable: true },
          { name: 'scheduleId', type: 'uuid', isNullable: true },
          { name: 'description', type: 'varchar', length: '500', isNullable: true },
          { name: 'dueDate', type: 'date', isNullable: true },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'incomes',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'incomes',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('incomes', true);
  }
}
