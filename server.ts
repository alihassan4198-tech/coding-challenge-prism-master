import "dotenv/config";
import { Client } from "pg";
import { backOff } from "exponential-backoff";
import express from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";
import { Sequelize } from "sequelize";
import * as componentController from "./backend/controller/componentController";
import * as propertiesController from "./backend/controller/propertiesController";

// Add your routes here
const setupApp = (client: Client): express.Application => {
  const app: express.Application = express();

  app.use(cors());

  app.use(express.json());

  app.get('/components', componentController.getComponents); // Route for fetching components
  app.get('/components/:componentId/properties', componentController.getPropertiesByComponentId); // Route for fetching properties by component ID
  app.patch('/properties/update/:propertyId', propertiesController.updateProperty);

  return app;
};



// Waits for the database to start and connects
const connect = async (): Promise<Client> => {
  console.log("Connecting");
  const resource = `tcp:${process.env.PGHOST}:${process.env.PGPORT}`;
  console.log(`Waiting for ${resource}`);
  await waitOn({ resources: [resource] });
  console.log("Initializing client");
  const client = new Client();
  await client.connect();
  console.log("Connected to database");
  // Ensure the client disconnects on exit
  onExit(async () => {
    console.log("onExit: closing client");
    await client.end();
  });

  return client;
};

export const sequelize = new Sequelize({
  database: process.env.PGDATABASE || 'postgres',
  username: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'draftbit',
  host: process.env.PGHOST || 'localhost',
  port: 12345,
  dialect: 'postgres'
});

const syncDatabase = async () => {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
};


const main = async () => {
  const client = await connect();
  await syncDatabase();
  const app = setupApp(client);
  app.locals.dbClient = client;
  const port = parseInt(process.env.SERVER_PORT);
  app.listen(port, () => {
    console.log(
      `Draftbit Coding Challenge is running at http://localhost:${port}/`
    );
  });
};

main();
