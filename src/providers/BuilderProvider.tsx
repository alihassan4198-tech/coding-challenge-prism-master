import React, { createContext, useContext, useState, ReactNode } from "react";

export type InputState = "default" | "changed" | "focused";

export interface ValueWithState {
  value: string;
  state: InputState;
  propertyId: number;
}

export interface BoxModel {
  marginTop: ValueWithState;
  marginRight: ValueWithState;
  marginBottom: ValueWithState;
  marginLeft: ValueWithState;
  paddingTop: ValueWithState;
  paddingRight: ValueWithState;
  paddingBottom: ValueWithState;
  paddingLeft: ValueWithState;
  height: ValueWithState;
  width: ValueWithState;
  backgroundColor: ValueWithState;
  color: ValueWithState;
  flexDirection: ValueWithState;
  alignItems: ValueWithState;
  justifyContent: ValueWithState;
  component_id: number;
}

const initialBoxModel: BoxModel = {
  marginTop: { value: "auto", state: "default", propertyId: 0 },
  marginRight: { value: "auto", state: "default", propertyId: 0 },
  marginBottom: { value: "auto", state: "default", propertyId: 0 },
  marginLeft: { value: "auto", state: "default", propertyId: 0 },
  paddingTop: { value: "auto", state: "default", propertyId: 0 },
  paddingRight: { value: "auto", state: "default", propertyId: 0 },
  paddingBottom: { value: "auto", state: "default", propertyId: 0 },
  paddingLeft: { value: "auto", state: "default", propertyId: 0 },
  height: { value: "auto", state: "default", propertyId: 0 },
  width: { value: "auto", state: "default", propertyId: 0 },
  backgroundColor: { value: "none", state: "default", propertyId: 0 },
  color: { value: "none", state: "default", propertyId: 0 },
  flexDirection: { value: "", state: "default", propertyId: 0 },
  alignItems: { value: "", state: "default", propertyId: 0 },
  justifyContent: { value: "", state: "default", propertyId: 0 },
  component_id: 0,
};

interface ButtonProperties {
  label: string;
  backgroundColor: string;
}

export interface ExtendedBoxModel extends BoxModel {
  buttonProperties: ButtonProperties | null;
}

export const initialExtendedBoxModel: ExtendedBoxModel = {
  ...initialBoxModel,
  buttonProperties: null,
};

interface BuilderContextType {
  state: ExtendedBoxModel;
  updateBoxModel: (newValues: ExtendedBoxModel) => void;
}

const BuilderContext = createContext<BuilderContextType>({
  state: initialExtendedBoxModel,
  updateBoxModel: () => {},
});

// export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, setState] = useState<ExtendedBoxModel>(initialExtendedBoxModel);

//   const updateBoxModel = (newValues: ExtendedBoxModel) => setState(newValues);

//   return (
//     <BuilderContext.Provider value={{ state, updateBoxModel }}>
//       {children}
//     </BuilderContext.Provider>
//   );
// };

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExtendedBoxModel>(initialExtendedBoxModel);

  const updateBoxModel = (newValues: ExtendedBoxModel | ((prevState: ExtendedBoxModel) => ExtendedBoxModel)) => {
    setState((prevState) =>
      typeof newValues === "function" ? newValues(prevState) : newValues
    );
  };

  return (
    <BuilderContext.Provider value={{ state, updateBoxModel }}>
      {children}
    </BuilderContext.Provider>
  );
};


// Hook to use the context
export const useBoxModel = () => useContext(BuilderContext);
