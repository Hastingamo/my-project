// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
// import { JwtModule } from '@nestjs/jwt';
// import { MailModule } from './Services/Mail.module';
// import { MailService } from './Services/mail.Services';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     JwtModule.registerAsync({
//       global: true,

//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//         signOptions: { expiresIn: '1h' },
//       }),
//     }),

//     // TypeOrmModule.forRoot({
//     //   type: 'postgres',
//     //   host: process.env.DB_HOST,
//     //   port: parseInt(process.env.DB_PORT || '5432', 10),
//     //   username: process.env.DB_USERNAME,
//     //   password: process.env.DB_PASSWORD,
//     //   database: process.env.DB_NAME,
//     //   autoLoadEntities: true,
//     //   synchronize: true,
//     // }),
//     TypeOrmModule.forRoot({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: +process.env.DB_PORT,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   autoLoadEntities: true,
//   synchronize: false,
//   ssl: { rejectUnauthorized: false },
// })
//     UsersModule,
//     AuthModule,
//     MailModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService, MailService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './Services/Mail.module';
import { MailService } from './Services/mail.Services';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,

      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT || '5432', 10),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: +(process.env.DB_PORT ?? 5432),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   autoLoadEntities: true,
    //   synchronize: false,
    //   ssl: { rejectUnauthorized: false },
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URLS,
      autoLoadEntities: true,
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
