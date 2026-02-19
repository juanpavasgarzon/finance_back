import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNotificationCodeColumn1739817600007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'notifications',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '50',
        isNullable: false,
        default: "'INFO'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('notifications', 'code');
  }
}
