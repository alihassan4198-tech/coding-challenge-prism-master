import React, { useCallback } from "react";
import { debounce } from "lodash";
import { useBoxModel } from "../providers/BuilderProvider";
import { UpdatePropertiesOfAComponent } from "../services/api";

const SizeComponent: React.FC = () => {
  const { state, updateBoxModel } = useBoxModel();

  const getStateClass = (inputState: "default" | "changed" | "focused") => {
    switch (inputState) {
      case "changed":
        return "input-changed";
      case "focused":
        return "input-focused";
      default:
        return "input-default";
    }
  };

  // Debounce the API call by 2 seconds
  const debouncedUpdate = useCallback(
    debounce(async (componentId, propertyId, property, value) => {
      try {
        const response = await UpdatePropertiesOfAComponent(
          componentId,
          propertyId,
          property,
          value,
          "changed"
        );
        if (response && response.property_id) {
          updateBoxModel({
            ...state,
            [property]: {
              state: "changed",
              propertyId: response.property_id,
            },
          });
        }
      } catch (error) {
        console.error("Failed to update component properties:", error);
      }
    }, 1000),
    [state]
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: string,
    propertyId: number
  ) => {
    const newValue = event.target.value;
    updateBoxModel({
      ...state,
      [property]: {
        value: newValue,
        state: "changed",
        propertyId: propertyId,
      },
    });

    debouncedUpdate(state.component_id, propertyId, property, newValue);
  };

  return (
    <div style={{ backgroundColor: '#3d4b6c', borderRadius: '10px', width: '95%', color: 'white'}}>
      <div style={{ display: 'grid', gap: '10px', padding: '20px' }}>
        {/* Width */}
        <label style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          Width:
          <input
            type="text"
            className={`input ${getStateClass(state.width.state)}`}
            style={{
              borderRadius: '5px',
              padding: '5px 10px',
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              border: '1px solid #1f9dd7',
              width: '100%',
              backgroundColor: '#3d4b6c',
            }}
            value={state.width.value}
            onChange={(e) => handleInputChange(e, "width", state.width.propertyId)}
          />
        </label>

        {/* Height */}
        <label style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          Height:
          <input
            type="text"
            className={`input ${getStateClass(state.height.state)}`}
            style={{
              borderRadius: '5px',
              padding: '5px 10px',
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              border: '1px solid #1f9dd7',
              width: '100%',
              backgroundColor: '#3d4b6c',
            }}
            value={state.height.value}
            onChange={(e) => handleInputChange(e, "height", state.height.propertyId)}
          />
        </label>
      </div>
    </div>
  );
};

export default SizeComponent;
