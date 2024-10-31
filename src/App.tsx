// App.tsx
import React, { useState } from "react";
import { BuilderProvider } from "./providers/BuilderProvider";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
// import { PropertiesPanel } from "./PropertiesPanel.gen";
import './styling/App.css';

const App: React.FC = () => {
  const [showFlexItems, setShowFlexItems] = useState(false);

  return (
    <BuilderProvider>
      <div className="App">
        <PropertiesPanel showFlexItems={showFlexItems} />
        <Canvas setShowFlexItems={setShowFlexItems} />
      </div>
    </BuilderProvider>
  );
};

export default App;
