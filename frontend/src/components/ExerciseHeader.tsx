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
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const yyyy = dateObj.getFullYear();
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - dateObj.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return `${mm}/${dd}/${yyyy} (${diffDays} days ago)`;
      })()}
    </span>
  </div>
);

export default ExerciseHeader;
