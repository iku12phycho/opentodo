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
    url: `${process.env.DB_URL}`,
    synchronize: false,
    logging: true,
    entities: ["entities/**/*.js"],
    migrations: ["db/migrations/**/*.js"],
    subscribers: ["db/subscriber/**/*.js"],
    cli: {
        entitiesDir: "entities",
        migrationsDir: "db/migrations",
        subscribersDir: "db/subscriber",
    },
};
exports.default = ormconfig;
