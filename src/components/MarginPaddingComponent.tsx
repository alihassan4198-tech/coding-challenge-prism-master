
import React, { useEffect, useState, useCallback } from "react";
import { useBoxModel } from "../providers/BuilderProvider";
import { UpdatePropertiesOfAComponent } from "../services/api";

interface InputFieldProps {
  label?: string;
  value: string;
  state: "default" | "changed" | "focused";
  property: string;
  propertyId: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, property: string, propertyId: number) => void;
  gridArea?: string;
  styleOverrides?: React.CSSProperties;
}

const InputField: React.FC<InputFieldProps> = ({ value, state, property, propertyId, onChange, gridArea, styleOverrides }) => {
  const getStateClass = (inputState: "default" | "changed" | "focused") => {
    return inputState === "changed" ? "input-changed" : inputState === "focused" ? "input-focused" : "input-default";
  };

  return (
    <input
      type="text"
      className={`input ${getStateClass(state)}`}
      style={{
        borderRadius: "5px",
        padding: "2% 4%",
        color: "white",
        fontSize: "14px",
        textAlign: "center",
        border: "1px solid #1f9dd7",
        backgroundColor: "#3d4b6c",
        width: "100%",
        gridArea: gridArea,
        borderBottom: state === "changed" ? "2px dotted yellow" : "1px solid #1f9dd7",
        ...styleOverrides,
      }}
      value={value}
      onChange={(e) => onChange(e, property, propertyId)}
    />
  );
};

const MarginPaddingComponent: React.FC = () => {
  const { state, updateBoxModel } = useBoxModel();
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, property: string, propertyId: number) => {
      const newValue = event.target.value;
      
      updateBoxModel({
        ...state,
        [property]: {
          value: newValue,
          state: "changed",
          propertyId: propertyId,
        },
      });

      if (debounceTimeout) clearTimeout(debounceTimeout);

      const timeoutId = window.setTimeout(async () => {
        try {
          const response = await UpdatePropertiesOfAComponent(state.component_id, propertyId, property, newValue, "changed");
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
      }, 1000);

      setDebounceTimeout(timeoutId);
    },
    [debounceTimeout, state, updateBoxModel]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  return (
    <div style={{ backgroundColor: "#3d4b6c", borderRadius: "10px", color: "white", padding: "20px", width: "90%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateAreas: `
            ". top ."
            "left center right"
            ". bottom ."
          `,
          gap: "4%",
          alignItems: "center",
          justifyItems: "center",
          backgroundColor: "#2f3b58",
          padding: "6%",
          borderRadius: "10px",
        }}
      >
        {/* Margin Top */}
        <InputField
          value={state.marginTop.value}
          state={state.marginTop.state}
          property="marginTop"
          propertyId={state.marginTop.propertyId}
          onChange={handleInputChange}
          gridArea="top"
          styleOverrides={{ width: "40%", height: "60%", marginBottom:'5%' }}
        />

        {/* Margin Left */}
        <InputField
          value={state.marginLeft.value}
          state={state.marginLeft.state}
          property="marginLeft"
          propertyId={state.marginLeft.propertyId}
          onChange={handleInputChange}
          gridArea="left"
          styleOverrides={{ width: "60%", height: "20%", marginRight:'40%' }}
        />

        {/* Center Box (with Padding Inputs) */}
        <div
          style={{
            gridArea: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "145%",
            padding: '4px',
            border: "2px solid #5f6b89",
            backgroundColor: "#2f3b58",
            borderRadius: "5px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Padding Top */}
            <InputField
              value={state.paddingTop.value}
              state={state.paddingTop.state}
              property="paddingTop"
              propertyId={state.paddingTop.propertyId}
              onChange={handleInputChange}
              styleOverrides={{ width: "25%" }}
            />

            {/* Padding Left and Right */}
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "15px" }}>
              <InputField
                value={state.paddingLeft.value}
                state={state.paddingLeft.state}
                property="paddingLeft"
                propertyId={state.paddingLeft.propertyId}
                onChange={handleInputChange}
                styleOverrides={{ width: "25%" }}
              />
              <InputField
                value={state.paddingRight.value}
                state={state.paddingRight.state}
                property="paddingRight"
                propertyId={state.paddingRight.propertyId}
                onChange={handleInputChange}
                styleOverrides={{ width: "25%" }}
              />
            </div>

            {/* Padding Bottom */}
            <InputField
              value={state.paddingBottom.value}
              state={state.paddingBottom.state}
              property="paddingBottom"
              propertyId={state.paddingBottom.propertyId}
              onChange={handleInputChange}
              styleOverrides={{ width: "25%" }}
            />
          </div>
        </div>

        {/* Margin Right */}
        <InputField
          value={state.marginRight.value}
          state={state.marginRight.state}
          property="marginRight"
          propertyId={state.marginRight.propertyId}
          onChange={handleInputChange}
          gridArea="right"
          styleOverrides={{ width: "60%", height: "20%", marginLeft:'40%' }}
        />

        {/* Margin Bottom */}
        <InputField
          value={state.marginBottom.value}
          state={state.marginBottom.state}
          property="marginBottom"
          propertyId={state.marginBottom.propertyId}
          onChange={handleInputChange}
          gridArea="bottom"
          styleOverrides={{ width: "40%", height: "50%", marginTop:'5%', marginBottom: "5%" }}
        />
      </div>
    </div>
  );
};

export default MarginPaddingComponent;
