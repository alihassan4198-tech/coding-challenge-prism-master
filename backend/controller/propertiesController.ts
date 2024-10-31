import { Request, Response } from "express";
import * as propertiesService from "../services/propertiesService";

export const updateProperty = async (req: Request, res: Response) => {
    try {
      const client = req.app.locals.dbClient;
      if (!client) {
        throw new Error("Database client is not initialized.");
      }
      const { propertyId } = req.params;
      const { property, value, state, componentId } = req.body;
  
      if (!state || !property || !value) {
        return res.status(400).json({ error: "Invalid payload. 'payload' must contain 'property', 'value', and 'state'." });
      }
  
      const updatedProperty = await propertiesService.updateProperty(client, propertyId, property, value, state, componentId);
      res.json(updatedProperty);
    } catch (error: any) {
      console.error("Error updating properties:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };