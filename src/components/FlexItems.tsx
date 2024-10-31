import React from "react";
import { useBoxModel } from "../providers/BuilderProvider";
import { UpdatePropertiesOfAComponent } from "../services/api";
import {
  BsAlignMiddle, BsAlignEnd, BsAlignTop, BsAlignBottom,
} from "react-icons/bs";
import {
  MdOutlineFormatAlignLeft, MdOutlineFormatAlignCenter, MdOutlineFormatAlignRight, MdOutlineFormatAlignJustify,
} from "react-icons/md";
import { RiAlignItemVerticalCenterFill } from "react-icons/ri";

interface FlexItemsProps {
  label: string;
  options: string[];
  stateProperty: { value: string; propertyId: number };
  iconMap: { [key: string]: React.ReactNode };
  property: string;
  handlePropertyChange: (property: string, value: string, propertyId: number) => void;
  additionalButton?: React.ReactNode;
}

const FlexItemButton: React.FC<FlexItemsProps> = ({ label, options, stateProperty, iconMap, property, handlePropertyChange, additionalButton }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: "5%" }}>
    <label style={{ marginRight: "5%" }}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {options.map((option) => (
        <button
          key={option}
          style={{
            padding: "2%",
            borderRadius: "5px",
            backgroundColor: stateProperty.value === option ? "#1f9dd7" : "#3d4b6c",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => handlePropertyChange(property, option, stateProperty.propertyId)}
          title={option}
        >
          {iconMap[option]}
        </button>
      ))}
      {additionalButton}
    </div>
  </div>
);

const FlexItems: React.FC = () => {
  const { state, updateBoxModel } = useBoxModel();

  const handleFlexPropertyChange = async (property: string, value: string, propertyId: number) => {
    updateBoxModel({
      ...state,
      [property]: {
        value,
        state: "changed",
        propertyId,
      },
    });
    try {
      await UpdatePropertiesOfAComponent(state.component_id, propertyId, property, value, "changed");
    } catch (error) {
      console.error("Failed to update component properties:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#3d4b6c", borderRadius: "10px", color: "white", padding: "20px" }}>
      <FlexItemButton
        label="Direction:"
        options={["row", "column"]}
        stateProperty={state.flexDirection}
        property="flexDirection"
        handlePropertyChange={handleFlexPropertyChange}
        iconMap={{
          row: <RiAlignItemVerticalCenterFill style={{ transform: "rotate(90deg)", width: "20px", height: "20px" }} />,
          column: <RiAlignItemVerticalCenterFill style={{ width: "20px", height: "20px" }} />,
        }}
        additionalButton={
          <button
            style={{
              padding: "2%",
              borderRadius: "5px",
              backgroundColor: state.flexDirection.value.includes("reverse") ? "#1f9dd7" : "#3d4b6c",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() =>
              handleFlexPropertyChange(
                "flexDirection",
                state.flexDirection.value.includes("reverse")
                  ? state.flexDirection.value.replace("-reverse", "")
                  : `${state.flexDirection.value}-reverse`,
                state.flexDirection.propertyId
              )
            }
            title="Reverse Direction"
          >
            Reverse
          </button>
        }
      />

      <FlexItemButton
        label="Align:"
        options={["flex-start", "center", "flex-end", "stretch"]}
        stateProperty={state.alignItems}
        property="alignItems"
        handlePropertyChange={handleFlexPropertyChange}
        iconMap={{
          "flex-start": <BsAlignTop style={{ width: "20px", height: "20px" }} />,
          center: <BsAlignMiddle style={{ width: "20px", height: "20px" }} />,
          "flex-end": <BsAlignBottom style={{ width: "20px", height: "20px" }} />,
          stretch: <BsAlignEnd style={{ width: "20px", height: "20px" }} />,
        }}
      />

      <FlexItemButton
        label="Justify:"
        options={["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]}
        stateProperty={state.justifyContent}
        property="justifyContent"
        handlePropertyChange={handleFlexPropertyChange}
        iconMap={{
          "flex-start": <MdOutlineFormatAlignLeft style={{ width: "20px", height: "20px" }} />,
          center: <MdOutlineFormatAlignCenter style={{ width: "20px", height: "20px" }} />,
          "flex-end": <MdOutlineFormatAlignRight style={{ width: "20px", height: "20px" }} />,
          "space-between": <MdOutlineFormatAlignJustify style={{ width: "20px", height: "20px" }} />,
          "space-around": <MdOutlineFormatAlignJustify style={{ width: "20px", height: "20px" }} />,
          "space-evenly": <MdOutlineFormatAlignJustify style={{ width: "20px", height: "20px" }} />,
        }}
      />
    </div>
  );
};

export default FlexItems;
