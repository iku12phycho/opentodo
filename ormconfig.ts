import { ConnectionOptions } from "typeorm";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.DB_PORT || '3300';

const ormconfig: ConnectionOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(port, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: ["entities/**/*.ts"],
  migrations: ["db/migrations/**/*.ts"],
  subscribers: ["db/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "entities",
    migrationsDir: "db/migrations",
    subscribersDir: "db/subscriber",
  },
};

export default ormconfig;