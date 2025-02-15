import dotenv from 'dotenv';
dotenv.config();

export const {
    DATABASE_URL = "localhost",
    DB_DATABASE = "prueba",
    DB_USER = "root",
    DB_PASSWORD = "root",
    DB_PORT = "5432",
    PORT = process.env.PORT || 4000,
    SECRET_JWT_KEY = 'default-secret-key',
    REFRESJ_JWT_KEY = 'default-refresh-key',
} = process.env