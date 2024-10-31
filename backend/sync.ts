import { Sequelize } from 'sequelize';
import Component from './entities/components';
import Property from './entities/properties';

// Initialize Sequelize with database credentials
export const sequelize = new Sequelize({
  database: process.env.PGDATABASE || 'postgres',
  username: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'draftbit',
  host: process.env.PGHOST || 'localhost',
  port: 12345,
  dialect: 'postgres'
});

export const syncDatabase = async () => {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
};

syncDatabase();
