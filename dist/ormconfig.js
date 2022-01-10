"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.DB_PORT || '3300';
const ormconfig = {
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
exports.default = ormconfig;
