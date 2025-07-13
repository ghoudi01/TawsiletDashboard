import axios from "axios";

/**
 * Fetches vehicle types from the settings API
 * @returns {Promise<Object>} Object with vehicle type IDs as keys and French names as values
 */
export const fetchVehicleTypes = async () => {
  try {
    const jwt = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}settings`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    
    // Transform the response to create the types object
    const types = {};
    
    if (response.data?.data) {
      response.data.data.forEach((setting) => {
        const id = setting.id.toString();
        const name = setting.name_fr || setting.name || `Type ${id}`;
        types[id] = name;
      });
    }
    
    return types;
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    // Fallback to default types if API fails
    return { "1": "Éco", "2": "Berline", "3": "Van" };
  }
};

/**
 * Fetches vehicle types and returns them as options for Select components
 * @returns {Promise<Array>} Array of objects with value and label properties
 */
export const fetchVehicleTypeOptions = async () => {
  try {
    const jwt = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}settings?filters[type][$eq]=vehicle_type&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    
    // Transform the response to create options for Select
    const options = [];
    
    if (response.data?.data) {
      response.data.data.forEach((setting) => {
        const id = setting.id.toString();
        const name = setting.name_fr || setting.name || `Type ${id}`;
        options.push({
          value: id,
          label: name,
        });
      });
    }
    
    return options;
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    // Fallback to default types if API fails
    return [
      { value: "1", label: "Éco" },
      { value: "2", label: "Berline" },
      { value: "3", label: "Van" },
    ];
  }
};

/**
 * Gets vehicle type name by ID
 * @param {Object} vehicleTypes - Object with vehicle type IDs as keys and names as values
 * @param {number|string} typeId - Vehicle type ID
 * @returns {string} Vehicle type name or fallback text
 */
export const getVehicleTypeName = (vehicleTypes, typeId) => {
  if (!typeId) return null;
  return vehicleTypes[typeId?.toString()] || `Type ${typeId}`;
}; 