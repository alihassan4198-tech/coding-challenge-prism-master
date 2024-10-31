import axios from "axios";

const API_BASE_URL = 'http://localhost:12346';

export const GetAllComponents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/components`);
      return response.data;
    } catch (error) {
      console.error("Error fetching components:", error);
      throw error;
    }
};

export const GetPropertiesOfAComponent = async (componentId: number) => {
    try {
        const  response = await axios.get(`${API_BASE_URL}/properties/${componentId}`)
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        throw error;
    }
};

export const UpdatePropertiesOfAComponent = async (componentId: number, propertyId: number, property: string, value: string, state: string) => {
  try {
    const payload = {
      componentId,
      property,  
      value,     
      state      
    };

    const response = await axios.patch(`${API_BASE_URL}/properties/update/${propertyId}`, payload);
    return response.data;  
  } catch (error) {
    console.error("Error updating properties:", error);  
    throw error;  
  }
};