import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSchedulesTable1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedules',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'tenant_id', type: 'uuid' },
          { name: 'categoryId', type: 'uuid' },
          { name: 'type', type: 'varchar', length: '20' },
          { name: 'name', type: 'varchar', length: '200' },
          { name: 'amount', type: 'decimal', precision: 14, scale: 2 },
          { name: 'recurrenceInterval', type: 'int' },
          { name: 'recurrenceUnit', type: 'varchar', length: '10' },
          { name: 'nextDueDate', type: 'date' },
          { name: 'startDate', type: 'date' },
          { name: 'endDate', type: 'date', isNullable: true },
          { name: 'description', type: 'varchar', length: '500', isNullable: true },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'schedules',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'schedules',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedules', true);
  }
}
