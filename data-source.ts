// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config();

// export default new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: +(process.env.DB_PORT ?? 5432),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/migrations/*.js'],
//   ssl: { rejectUnauthorized: false },
// });

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URLS,
  entities: ['dist/**/*.entity.js'],
  // migrations: ['dist/migrations/*.js'],
  migrations: ['dist/src/migrations/*.js'],

  ssl: { rejectUnauthorized: false },
});
