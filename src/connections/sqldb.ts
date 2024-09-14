import mysql2, { Pool, PoolOptions } from "mysql2/promise";

const poolOptions: PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export const pool: Pool = mysql2.createPool(poolOptions);
