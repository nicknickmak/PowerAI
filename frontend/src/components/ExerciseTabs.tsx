import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ExerciseCard from "./ExerciseCard";

export interface Session {
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
  "rear deltoids": "Shoulders",
  "side deltoids": "Shoulders",
  "front deltoids": "Shoulders",
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
        padding: "clamp(12px, 5vw, 32px)",
        maxWidth: 700,
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
              fontWeight: "bold",
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
