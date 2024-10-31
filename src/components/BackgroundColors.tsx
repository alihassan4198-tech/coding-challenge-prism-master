import React from "react";
import { useBoxModel } from "../providers/BuilderProvider";
import { UpdatePropertiesOfAComponent } from "../services/api";

type PropertyKeys = "backgroundColor" | "color";

interface ColorInputProps {
  label: string;
  property: PropertyKeys;
  colorValue: string;
  stateClass: string;
  onColorChange: (event: React.ChangeEvent<HTMLInputElement>, property: PropertyKeys) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, property, colorValue, stateClass, onColorChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
    <label style={{ color: 'white', fontSize: '14px' }}>{label}</label>
    <input
      type="color"
      className={`input ${stateClass}`}
      style={{
        borderRadius: '5px',
        width: '40px',
        height: '40px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#3d4b6c',
      }}
      value={colorValue}
      onChange={(e) => onColorChange(e, property)}
    />
    <input
      type="text"
      className={`input ${stateClass}`}
      style={{
        borderRadius: '5px',
        padding: '5px 10px',
        color: 'white',
        fontSize: '14px',
        border: '1px solid #1f9dd7',
        width: '100%',
        backgroundColor: '#3d4b6c',
        textAlign: 'center',
      }}
      value={colorValue}
      onChange={(e) => onColorChange(e, property)}
    />
  </div>
);

const BackgroundColors: React.FC = () => {
  const { state, updateBoxModel } = useBoxModel();

  const getStateClass = (inputState: "default" | "changed" | "focused") => {
    const classes = {
      default: "input-default",
      changed: "input-changed",
      focused: "input-focused",
    };
    return classes[inputState] || classes.default;
  };

  const handleColorChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    property: PropertyKeys
  ) => {
    const newColor = event.target.value;
    const propertyId = state[property].propertyId;

    try {
      const response = await UpdatePropertiesOfAComponent(
        state.component_id,
        propertyId,
        property,
        newColor,
        "changed"
      );
      if (response && response.property_id) {
        updateBoxModel({
          ...state,
          [property]: {
            value: newColor,
            state: "changed",
            propertyId: response.property_id,
          },
        });
      }
    } catch (error) {
      console.error(`Failed to update ${property}:`, error);
    }
  };

  return (
    <div style={{ backgroundColor: '#3d4b6c', borderRadius: '10px', color: 'white', padding: '20px' }}>
      <ColorInput
        label="Background Color:"
        property="backgroundColor"
        colorValue={state.backgroundColor.value || "#FFEB3B"}
        stateClass={getStateClass(state.backgroundColor.state)}
        onColorChange={handleColorChange}
      />
      <ColorInput
        label="Text Color:"
        property="color"
        colorValue={state.color.value || "#FFFFFF"}
        stateClass={getStateClass(state.color.state)}
        onColorChange={handleColorChange}
      />
    </div>
  );
};

export default BackgroundColors;
