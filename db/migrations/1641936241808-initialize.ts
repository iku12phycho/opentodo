import {MigrationInterface, QueryRunner} from "typeorm";

export class initialize1641936241808 implements MigrationInterface {
    name = 'initialize1641936241808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`mail_address\` varchar(255) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL DEFAULT '', \`google_id\` varchar(255) NOT NULL DEFAULT '', \`display_name\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`is_admin\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`process_status\` int NOT NULL, \`is_secret\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_f316d3fe53497d4d8a2957db8b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_f316d3fe53497d4d8a2957db8b9\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
