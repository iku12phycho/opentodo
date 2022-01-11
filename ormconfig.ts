import { ConnectionOptions } from "typeorm";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.DB_PORT || '3300';

const ormconfig: ConnectionOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  url: `${process.env.DB_URL}`,
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