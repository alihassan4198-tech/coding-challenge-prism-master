import React, { useEffect, useState } from "react";
import { BoxModel, ExtendedBoxModel, initialExtendedBoxModel, InputState, useBoxModel, ValueWithState } from "../providers/BuilderProvider";
import { GetAllComponents } from "../services/api";

interface Component {
  component_id: number;
  component_name: string;
  component_type: string;
  properties?: Property[];
  propertiesMap?: { [key: string]: { value: string; propertyId: number } };
}

interface Property {
  property_id: number;
  prop_component_id: number;
  name: string;
  default_value: string;
  value?: string;
  state?: string;
  unit?: string;
}

interface CanvasProps {
  setShowFlexItems: React.Dispatch<React.SetStateAction<boolean>>;
}

const Canvas: React.FC<CanvasProps> = ({ setShowFlexItems }) => {
  const { state, updateBoxModel } = useBoxModel();
  const [components, setComponents] = useState<Component[]>([]);

  const getComponents = async () => {
    try {
      const response = await GetAllComponents();
      const formattedComponents = response.map((component: Component) => {
        const componentProperties = component.properties || [];
        const propertiesMap = componentProperties.reduce((acc: any, prop) => {
          acc[prop.name] = {
            value: prop.value,
            propertyId: prop.property_id,
          };
          return acc;
        }, {});
        return {
          ...component,
          propertiesMap,
        };
      });
      setComponents(formattedComponents);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const applyProperties = (propertiesMap: { [key: string]: { value: string; propertyId: number } }) => {
    return Object.keys(propertiesMap).reduce((styleAcc: any, propName) => {
      styleAcc[propName] = propertiesMap[propName].value;
      return styleAcc;
    }, {});
  };

  const handleClick = (component: Component) => {
    if (!component || !component.properties) return;
    
    setShowFlexItems(component.component_type.toLocaleLowerCase() === "container");
    const updatedState: ExtendedBoxModel = {
      ...initialExtendedBoxModel,
      component_id: component.component_id,
    };

    component.properties.forEach((property) => {
      const { name, state, value, property_id } = property;
      const finalState: InputState = ["default", "changed", "focused"].includes(state || "")
        ? (state as InputState)
        : "default";
      const finalValue = value || "default";

      if (name in updatedState) {
        (updatedState[name as keyof BoxModel] as ValueWithState) = {
          value: finalValue,
          state: finalState,
          propertyId: property_id,
        };
      }
    });
    updateBoxModel(updatedState);
  };

  useEffect(() => {
    getComponents();
  }, []);

  useEffect(() => {
    getComponents();
  }, [state]);

  const containerComponent = components.find((comp) => comp.component_name === "div");
  const containerStyle = containerComponent?.propertiesMap ? applyProperties(containerComponent.propertiesMap) : {};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          overflow: 'hidden',
          ...containerStyle,
        }}
        onClick={() => containerComponent && handleClick(containerComponent)}
      >
        {components.map((component) => {
          if (component.component_name.toLocaleLowerCase() === "container") return null;

          const componentStyle = component.propertiesMap ? applyProperties(component.propertiesMap) : {};
          return (
            <div key={component.component_id}>
              {component.component_name.includes("Button") ? (
                <button
                  style={componentStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(component);
                  }}
                >
                  {component.component_name}
                </button>
              ) : component.component_name.includes("Input") ? (
                <input
                  type="text"
                  placeholder={`Enter ${component.component_name}`}
                  style={componentStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(component);
                  }}
                />
              ) : <></>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Canvas;
