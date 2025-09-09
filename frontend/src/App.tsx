import React, { useState } from "react";
import "./App.css";
import { WorkoutInput } from "./components/WorkoutInput";
import { ExerciseTabs } from "./components/ExerciseTabs";
import {
  fetchExercises as apiFetchExercises,
  queryWorkout,
  submitWorkout,
} from "./services/apiService";

const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

function parseWorkoutInput(input: string) {
  // Simple parser: returns array of exercises with sets
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const result: { name: string; sets: any[] }[] = [];
  let currentExercise: { name: string; sets: any[] } | null = null;
  lines.forEach((line) => {
    if (/^[A-Za-z ]+$/.test(line)) {
      if (currentExercise) result.push(currentExercise);
      currentExercise = { name: line, sets: [] };
    } else if (/^\d+[xX]\s*\d+/.test(line)) {
      // Handles '225x5', '225x 5', '225X5', '225X 5'
      const match = line.match(/^(\d+)[xX]\s*(\d+)/);
      if (match) {
        const weight = match[1];
        const reps = match[2];
        currentExercise?.sets.push({
          weight: Number(weight),
          reps: Number(reps),
          note: line.includes("dropset") ? "dropset" : "",
        });
      } else if (currentExercise) {
        currentExercise.sets.push({ note: line });
      }
    } else if (currentExercise) {
      currentExercise.sets.push({ note: line });
    }
  });
  if (currentExercise) result.push(currentExercise);
  return result;
}

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"workout" | "exercises">(
    "workout"
  );
  const [activeMuscle, setActiveMuscle] = useState<string>(MUSCLE_GROUPS[0]);
  const [exercises, setExercises] = useState<any[]>([]);

  const fetchExercises = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchExercises();
      setExercises(data.exercises || []);
    } catch (e) {
      setError(
        "Failed to fetch exercises from backend: " +
          (e instanceof Error ? e.message : String(e))
      );
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (activeTab === "exercises") {
      fetchExercises();
    }
  }, [activeTab]);

  // New API flow: handleQuery calls /query and sets normalized result
  const handleQuery = async (inputText: string) => {
    setLoading(true);
    setError("");
    setQueryResult(null);
    try {
      // Parse input before sending to /query
      const parsedWorkout = parseWorkoutInput(inputText);
      const data = await queryWorkout(parsedWorkout);
      setQueryResult(data.normalized || data);
    } catch (e) {
      setError(
        `Failed to get normalized workout from backend: ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
    setLoading(false);
  };

  // Confirm/submit normalized workout
  const handleConfirm = async (normalized: any) => {
    setLoading(true);
    setError("");
    try {
      await submitWorkout(normalized);
    } catch (e) {
      setError(
        "Failed to submit workout to backend: " +
          (e instanceof Error ? e.message : String(e))
      );
    }
    setLoading(false);
  };

  // Cancel confirmation
  const handleCancel = () => {
    setQueryResult(null);
    setError("");
  };

  return (
    <div className="App">
      <header
        className="App-header no-vertical-center"
        style={{
          background: "#222",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1
          style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 900,
            fontSize: 36,
            color: "#00df00",
            marginBottom: 10,
            letterSpacing: 1,
          }}
        >
          PowerAI
        </h1>
        <nav
          style={{
            marginBottom: 28,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <button
            onClick={() => setActiveTab("workout")}
            style={{
              fontWeight: activeTab === "workout" ? "bold" : "normal",
              background: activeTab === "workout" ? "#00df00" : "#333",
              color: activeTab === "workout" ? "#222" : "#e7e7e7",
              border: "none",
              borderRadius: 8,
              padding: "10px 32px",
              fontSize: 18,
              boxShadow:
                activeTab === "workout"
                  ? "0 2px 8px rgba(0,223,0,0.08)"
                  : "none",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            Workout
          </button>
          <button
            onClick={() => setActiveTab("exercises")}
            style={{
              fontWeight: activeTab === "exercises" ? "bold" : "normal",
              background: activeTab === "exercises" ? "#00df00" : "#333",
              color: activeTab === "exercises" ? "#222" : "#e7e7e7",
              border: "none",
              borderRadius: 8,
              padding: "10px 32px",
              fontSize: 18,
              boxShadow:
                activeTab === "exercises"
                  ? "0 2px 8px rgba(0,223,0,0.08)"
                  : "none",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            Exercises
          </button>
        </nav>
        {activeTab === "workout" ? (
          <WorkoutInput
            input={input}
            setInput={setInput}
            loading={loading}
            error={error}
            queryResult={queryResult}
            handleQuery={handleQuery}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
          />
        ) : (
          <ExerciseTabs
            muscleGroups={MUSCLE_GROUPS}
            activeMuscle={activeMuscle}
            setActiveMuscle={setActiveMuscle}
            exercises={exercises}
          />
        )}
      </header>
    </div>
  );
}

export default App;
