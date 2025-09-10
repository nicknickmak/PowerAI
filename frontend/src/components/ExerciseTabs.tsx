import React from "react";
import { Chart } from "react-google-charts";
import ExerciseHeader from "./ExerciseHeader";
import ChartSwitcher from "./ChartSwitcher";
import ExerciseChart from "./ExerciseChart";
import LoadingSpinner from "./LoadingSpinner";

interface Exercise {
  name: string;
  muscle: string;
  lastDate: string;
  sets: { weight: number; reps: number }[];
}

interface ExerciseTabsProps {
  loading: boolean;
  muscleGroups: string[];
  activeMuscle: string;
  setActiveMuscle: (muscle: string) => void;
  exercises: Exercise[];
}

const ExerciseCard: React.FC<{ ex: Exercise }> = ({ ex }) => {
  const [activeChart, setActiveChart] = React.useState<"line" | "bar">("line");
  const lineData = [
    ["Date", "Weight", "Reps"],
    ...ex.sets.map((set, idx) => [ex.lastDate, set.weight, set.reps]),
  ];
  const barData = [
    ["Date", "Weight", { role: "annotation" }, "Reps", { role: "annotation" }],
    ...ex.sets.map((set, idx) => [
      ex.lastDate,
      set.weight,
      String(set.weight),
      set.reps,
      String(set.reps),
    ]),
  ];
  return (
    <div
      style={{
        background: "#222",
        margin: "8px 0",
        padding: 8,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: 600,
        minWidth: 600,
        maxWidth: "100%",
      }}
    >
      <ExerciseHeader name={ex.name} lastDate={ex.lastDate} />
      <div
        style={{ display: "flex", gap: 12, marginTop: 0, alignItems: "center" }}
      >
        <ExerciseChart
          activeChart={activeChart}
          lineData={lineData}
          barData={barData}
        />
        <ChartSwitcher
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />
      </div>
    </div>
  );
};

export const ExerciseTabs: React.FC<ExerciseTabsProps> = ({
  loading,
  muscleGroups,
  activeMuscle,
  setActiveMuscle,
  exercises,
}) => {
  const filteredExercises = exercises
    .filter((ex) => ex.muscle === activeMuscle)
    .sort((a, b) => (a.lastDate < b.lastDate ? 1 : -1));

  return (
    <div
      style={{
        background: "#181818",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        padding: 32,
        maxWidth: 700,
        margin: "32px auto",
        color: "#e7e7e7",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 18,
          color: "#00df00",
          fontWeight: 900,
          fontSize: 32,
          letterSpacing: 1,
        }}
      >
        My Exercises
      </h1>
      <div
        style={{
          marginBottom: 18,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {muscleGroups.map((muscle) => (
          <button
            key={muscle}
            onClick={() => setActiveMuscle(muscle)}
            style={{
              fontWeight: activeMuscle === muscle ? "bold" : "normal",
              background: activeMuscle === muscle ? "#00df00" : "#333",
              color: activeMuscle === muscle ? "#222" : "#e7e7e7",
              border: "none",
              borderRadius: 8,
              padding: "8px 24px",
              fontSize: 16,
              boxShadow:
                activeMuscle === muscle
                  ? "0 2px 8px rgba(0,223,0,0.08)"
                  : "none",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            {muscle}
          </button>
        ))}
      </div>
      <div>
        {loading ? (
          <LoadingSpinner message="Loading exercises..." />
        ) : filteredExercises.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#ff3333",
              fontWeight: "bold",
              fontSize: 18,
              marginTop: 32,
            }}
          >
            No exercises for this muscle group yet.
          </div>
        ) : (
          filteredExercises.map((ex, i) => <ExerciseCard key={i} ex={ex} />)
        )}
      </div>
    </div>
  );
};
