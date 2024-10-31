
import { Request, Response } from "express";
import * as componentService from "../services/componentService";

export const getComponents = async (req: Request, res: Response) => {
  try {
    const client = req.app.locals.dbClient;
    if (!client) {
      throw new Error("Database client is not initialized.");
    }
    const components = await componentService.getComponents(client);
    res.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPropertiesByComponentId = async (req: Request, res: Response) => {
  try {
    const client = req.app.locals.dbClient;
    if (!client) {
      throw new Error("Database client is not initialized.");
    }
    const { componentId } = req.params;
    const properties = await componentService.getPropertiesByComponentId(client, componentId);
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


