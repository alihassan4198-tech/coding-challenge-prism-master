import { Client } from "pg";

export const getComponents = async (client: Client) => {
  const { rows } = await client.query(`
    SELECT 
      components.name AS component_name,
      components.component_id AS component_id,
      components.type AS component_type,
      JSON_AGG(
          JSON_BUILD_OBJECT(
              'name', properties.name,
              'property_id', properties.property_id,
              'prop_component_id', properties.component_id,
              'state', properties.state,
              'value', properties.value,
              'description', properties.description,
              'default_value', properties.default_value
          )
      ) AS properties
    FROM 
        components 
    JOIN 
        properties 
    ON 
        components.component_id = properties.component_id 
    WHERE 
        properties.is_active = true
    GROUP BY 
        components.component_id
  `);
  return rows;
};

export const getPropertiesByComponentId = async (client: Client, componentId: string) => {
  const { rows } = await client.query(
    `SELECT * FROM properties WHERE component_id = $1`, 
    [componentId]
  );
  return rows;
};


