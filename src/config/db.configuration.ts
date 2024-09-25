import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';

config();

const getEnv = (key: string) => {
  if (process.env.LOCAL === 'true') {
    return process.env[key + '_LOCAL'];
  }
  return process.env[key];
};

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: getEnv('DB_TYPE') as 'mysql' | 'postgres',
  host: getEnv('DB_HOST'),
  port: parseInt(getEnv('DB_PORT'), 10) || 5432,
  username: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  // logging: true,
  // logging: ['query', 'error'],
  seeds: ['dist/config/seeds/**.seeder.js'],
};
