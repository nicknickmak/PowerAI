import React from "react";

const ChartSwitcher: React.FC<{
  activeChart: "line" | "bar";
  setActiveChart: (type: "line" | "bar") => void;
}> = ({ activeChart, setActiveChart }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginLeft: 12,
    }}
  >
    <button
      style={{
        background: activeChart === "line" ? "#00df00" : "#444",
        color: "#222",
        border: "none",
        borderRadius: 4,
        padding: "2px 8px",
        cursor: "pointer",
        fontWeight: activeChart === "line" ? "bold" : "normal",
      }}
      onClick={() => setActiveChart("line")}
    >
      Line
    </button>
    <button
      style={{
        background: activeChart === "bar" ? "#ff3333" : "#444",
        color: "#222",
        border: "none",
        borderRadius: 4,
        padding: "2px 8px",
        cursor: "pointer",
        fontWeight: activeChart === "bar" ? "bold" : "normal",
      }}
      onClick={() => setActiveChart("bar")}
    >
      Bar
    </button>
  </div>
);

export default ChartSwitcher;
