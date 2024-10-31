// PropertiesPanel.tsx
import React from "react";
import "../styling/PropertiesPanel.css";
import MarginPaddingComponent from "./MarginPaddingComponent";
import { ViewExamples } from "../PropertiesPanel.bs";
import SizeComponent from "./SizeComponent";
import BackgroundColors from "./BackgroundColors";
import FlexItems from "./FlexItems";

const Collapsible: React.FC<{ title: string }> = ({ title, children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <section className="Collapsible">
      <button
        className="Collapsible-button"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span>{title}</span> <span>{collapsed ? "+" : "-"}</span>
      </button>
      {!collapsed && <div className="Collapsible-content">{children}</div>}
    </section>
  );
};

interface PropertiesPanelProps {
  showFlexItems: boolean;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ showFlexItems }) => {
  console.log("PropertiesPanelshowFlexItems", showFlexItems);
  
  return (
    <aside className="PropertiesPanel">
      <Collapsible title="Size">
        <SizeComponent />
      </Collapsible>
      <Collapsible title="Margins & Padding">
        <MarginPaddingComponent />
      </Collapsible>
      <Collapsible title="Background colors">
        <BackgroundColors />
      </Collapsible>
      {showFlexItems ? (
        <Collapsible title="Flex Items">
          <FlexItems />
        </Collapsible>
      ):(
        <div></div>
      )}
    </aside>
  );
};

export default PropertiesPanel;

