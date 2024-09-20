import { DataSource, DataSourceOptions } from 'typeorm';
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
  database: 'sagetest',
  entities: [__dirname + '/db.test-entity.ts'],
  synchronize: true,
  seeds: ['dist/config/seeds/**.seeder.js'],
};

// Create and export the DataSource instance
export const dataSource = new DataSource(dataSourceOptions);

dataSource.entityMetadatas.forEach((entity) => {
  console.log(entity.tableName);
});
