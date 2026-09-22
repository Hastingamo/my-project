import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1790091497909 implements MigrationInterface {
    name = 'Init1790091497909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "userName" character varying NOT NULL, "role" character varying NOT NULL, "hashedRefreshToken" character varying, "isOAuth" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "forgot_password" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, CONSTRAINT "PK_9b1bedb8b9dd6834196533ee41b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "forgot_password"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
