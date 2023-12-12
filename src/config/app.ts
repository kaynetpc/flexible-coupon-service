import { getEnv } from ".";



export const AppConfigs = {
    PORT: getEnv('PORT', '8080'),
    SERVER_PATH: getEnv('SERVER_PATH', '/api'),
    IS_DEV: getEnv('NODE_ENV', 'development') === "development",

    // DB CONNECTION
    PG_DB_USERNAME: getEnv('PG_DB_USERNAME'),
    PG_DB_NAME: getEnv('PG_DB_NAME'),
    PG_DB_PORT: getEnv('PG_DB_PORT'),
    PG_DB_PASSWORD: getEnv('PG_DB_PASSWORD'),
    PG_DB_HOST: getEnv('PG_DB_HOST'),

    
}