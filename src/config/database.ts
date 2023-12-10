import { Sequelize } from 'sequelize-typescript';
import { AppConfigs } from './app';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: AppConfigs.PG_DB_NAME,
  username: AppConfigs.PG_DB_USERNAME,
  password: AppConfigs.PG_DB_PASSWORD,
  host: AppConfigs.PG_DB_HOST,
  port: Number(AppConfigs.PG_DB_PORT),
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        } catch (error) {
        console.error('Unable to connect to the database:', error);
    }           
}

export default sequelize;