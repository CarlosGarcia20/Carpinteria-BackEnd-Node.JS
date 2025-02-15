import pg from "pg";
import { DATABASE_URL, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT } from "./config.js";

export const pool = new pg.Pool({
    host: DATABASE_URL,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT
})