import React from "react";

const ExerciseHeader: React.FC<{ name: string; lastDate: string }> = ({
  name,
  lastDate,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 4,
    }}
  >
    <strong>{name}</strong>
    <span style={{ color: "#aaa", fontSize: 12, marginTop: 2 }}>
      {(() => {
        const dateObj = new Date(lastDate);
        const today = new Date();
        const diffDays = Math.floor(
          (today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
        );
        return `Last: ${dateObj.toLocaleDateString()} (${diffDays}d ago)`;
      })()}
    </span>
  </div>
);

export default ExerciseHeader;
