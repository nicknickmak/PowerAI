import React from "react";

const muscleGroups = [
  { name: "Chest", days: 3 },
  { name: "Back", days: 5 },
  { name: "Legs", days: 1 },
  { name: "Shoulders", days: 7 },
  { name: "Arms", days: 2 },
  { name: "Core", days: 4 },
];

export const MuscleGroupLastWorkout: React.FC = () => (
  <div style={{ marginTop: 32 }}>
    <h2
      style={{
        borderBottom: "1px solid #333",
        paddingBottom: 4,
        marginBottom: 8,
      }}
    >
      Days Since Last Workout (per muscle group)
    </h2>
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        maxWidth: 320,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {muscleGroups.map((group) => (
        <li
          key={group.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#333",
            borderRadius: 6,
            padding: "8px 16px",
            marginBottom: 8,
            fontSize: 16,
            fontWeight: "bold",
            color: "#e7e7e7",
          }}
        >
          <span>{group.name}</span>
          <span style={{ color: "#00df00", fontSize: 18 }}>{group.days}</span>
        </li>
      ))}
    </ul>
  </div>
);
