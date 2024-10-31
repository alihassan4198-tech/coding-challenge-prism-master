import { Client } from "pg";


export const updateProperty = async (
    client: Client, 
    propertyId: string, 
    property: string, 
    value: string, 
    state: string, 
    componentId: string
  ) => {
    const updateQuery = `
      UPDATE properties
      SET value = $1, state = $2
      WHERE property_id = $3
    `;
  
    const result = await client.query(updateQuery, [value, state, propertyId]);
  
    if (result.rowCount === 0) {
      return await createProperty(client, property, value, state, componentId, propertyId);
    }
  
    const { rows } = await client.query(
      `SELECT * FROM properties WHERE property_id = $1`, 
      [propertyId]
    );
    return rows[0];
  };
  
  const createProperty = async (
    client: Client,
    property: string,
    value: string,
    state: string,
    componentId: string,
    propertyId: string
  ) => {
    const insertQuery = `
      INSERT INTO properties (
        component_id, name, default_value, value, state, unit, description, is_required, is_inherited
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *;
    `;
  
    const newPropertyValues = [
      componentId, property, "0px", value, state, "px", `update value for ${property}`, false, false
    ];
    const insertResult = await client.query(insertQuery, newPropertyValues);
    return insertResult.rows[0];
  };