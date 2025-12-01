import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ExerciseCard from "./ExerciseCard";
import styles from "./ExerciseTabs.module.css";

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
    <div className={styles["exercise-tabs"]}>
      <h1 className={styles["exercise-tabs-title"]}>My Exercises</h1>
      <div className={styles["exercise-tabs-nav"]}>
        {muscleGroups.map((muscle) => (
          <button
            key={muscle}
            onClick={() => setActiveMuscle(muscle)}
            className={
              styles["exercise-tabs-btn"] +
              (activeMuscle === muscle ? " " + styles["active"] : "")
            }
          >
            {muscle}
          </button>
        ))}
      </div>
      <div>
        {loading ? (
          <LoadingSpinner message="Loading sessions..." />
        ) : exerciseNames.length === 0 ? (
          <div className={styles["exercise-tabs-empty"]}>
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
