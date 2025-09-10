import React from "react";
import { Chart } from "react-google-charts";
import ExerciseHeader from "./ExerciseHeader";
import ChartSwitcher from "./ChartSwitcher";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import LoadingSpinner from "./LoadingSpinner";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//TODO: refactor to sessions
interface Session {
  date: string;
  location: string;
  sets: Set[];
}

interface Set {
  exercise: string;
  equipment: string;
  primaryMuscle: string;
  secondaryMuscle?: string;
  weight: number;
  reps: number;
  rpe: number;
  note?: string;
  timestamp?: string; // TODO: remove this from API
}

interface SessionsTabsProps {
  loading: boolean;
  muscleGroups: string[];
  activeMuscle: string;
  setActiveMuscle: (muscle: string) => void;
  sessions: Session[];
}

const ExerciseCard: React.FC<{ sessions: Session[]; exerciseName: string }> = ({
  sessions,
  exerciseName,
}) => {
  const [activeChart, setActiveChart] = React.useState<"line" | "bar">("line");
  // Aggregate all sets for this exercise across sessions
  const allSets = sessions.flatMap((session) =>
    session.sets
      .filter((set) => set.exercise === exerciseName)
      .map((set) => ({ ...set, date: session.date }))
  );

  const lineData = [
    ["Date", "Weight", "Reps"],
    ...allSets.map((set) => [set.date, set.weight, set.reps]),
  ];
  const barData = [
    ["Date", "Weight", { role: "annotation" }, "Reps", { role: "annotation" }],
    ...allSets.map((set) => [
      set.date,
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
      <ExerciseHeader
        name={exerciseName}
        lastDate={allSets.length > 0 ? allSets[allSets.length - 1].date : ""}
      />
      <div
        style={{ display: "flex", gap: 12, marginTop: 0, alignItems: "center" }}
      >
        {/* Inline chart rendering logic */}
        {(() => {
          // Convert Google Chart data format to Chart.js format
          let chartData;
          if (activeChart === "line") {
            const labels = lineData.slice(1).map((row) => row[0]);
            const weights = lineData.slice(1).map((row) => row[1]);
            const reps = lineData.slice(1).map((row) => row[2]);
            chartData = {
              labels,
              datasets: [
                {
                  label: "Weight",
                  data: weights,
                  borderColor: "#00df00",
                  backgroundColor: "rgba(0,223,0,0.2)",
                },
                {
                  label: "Reps",
                  data: reps,
                  borderColor: "#ff3333",
                  backgroundColor: "rgba(255,51,51,0.2)",
                },
              ],
            };
          } else {
            const labels = barData.slice(1).map((row) => row[0]);
            const weights = barData.slice(1).map((row) => row[1]);
            const reps = barData.slice(1).map((row) => row[3]);
            chartData = {
              labels,
              datasets: [
                {
                  label: "Weight",
                  data: weights,
                  backgroundColor: "#00bfff",
                },
                {
                  label: "Reps",
                  data: reps,
                  backgroundColor: "#ff3333",
                },
              ],
            };
          }
          const chartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: exerciseName + " Progress",
              },
            },
          };
          return (
            <div style={{ width: "100%", height: "400px" }}>
              {activeChart === "line" ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
          );
        })()}
        <ChartSwitcher
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />
      </div>
    </div>
  );
};

export const ExerciseTabs: React.FC<SessionsTabsProps> = ({
  loading,
  muscleGroups,
  activeMuscle,
  setActiveMuscle,
  sessions,
}) => {
  // Map specific muscles to major groups
  const muscleGroupMap: Record<string, string> = {
    chest: "Chest",
    pecs: "Chest",
    back: "Back",
    lats: "Back",
    traps: "Back",
    quads: "Legs",
    hamstrings: "Legs",
    calves: "Legs",
    glutes: "Legs",
    shoulders: "Shoulders",
    delts: "Shoulders",
    biceps: "Arms",
    triceps: "Arms",
    forearms: "Arms",
    abs: "Core",
    core: "Core",
    obliques: "Core",
    // Add more as needed
  };

  // We want to go through each session
  // then go through each set in the session and
  // group them by exercise name,
  // then filter by activeMuscle
  //

  // Group sets by exercise name for the selected muscle group
  const exerciseToSessions: Record<string, Session[]> = {};
  sessions.forEach((session) => {
    session.sets.forEach((set) => {
      const primaryKey = set.primaryMuscle
        ? set.primaryMuscle.toLowerCase()
        : "";
      const secondaryKey = set.secondaryMuscle
        ? set.secondaryMuscle.toLowerCase()
        : "";
      if (
        muscleGroupMap[primaryKey] === activeMuscle ||
        muscleGroupMap[secondaryKey] === activeMuscle
      ) {
        if (!exerciseToSessions[set.exercise]) {
          exerciseToSessions[set.exercise] = [];
        }
        // Push session if not already present for this exercise
        if (!exerciseToSessions[set.exercise].includes(session)) {
          exerciseToSessions[set.exercise].push(session);
        }
      }
    });
  });

  const exerciseNames = Object.keys(exerciseToSessions);

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
          flexWrap: "wrap",
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
          <LoadingSpinner message="Loading sessions..." />
        ) : exerciseNames.length === 0 ? (
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
          exerciseNames.map((name) => (
            <ExerciseCard
              key={name}
              sessions={exerciseToSessions[name]}
              exerciseName={name}
            />
          ))
        )}
      </div>
    </div>
  );
};
