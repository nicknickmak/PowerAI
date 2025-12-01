import React, { useState } from "react";
import "./App.css";
import { WorkoutInput } from "./components/WorkoutInput";
import { ExerciseTabs } from "./components/ExerciseTabs";
import {
  fetchSessions as apiFetchSessions,
  queryWorkout,
  submitWorkout,
  WorkoutQueryResult,
} from "./services/apiService";

const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

function parseWorkoutInput(
  input: string
): [{ name: string; sets: any[] }[], Date] {
  // Simple parser: returns array of exercises with sets
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const result: { name: string; sets: any[] }[] = [];
  // Get current date in local time zone (YYYY-MM-DD)
  let workoutDate = new Date();

  let currentExercise: { name: string; sets: any[] } | null = null;
  lines.forEach((line) => {
    // Date format: YYYY-MM-DD or MM/DD/YYYY or similar
    if (
      /^(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}[\/-]\d{1,2})$/.test(
        line
      )
    ) {
      // Handles YYYY-MM-DD, MM/DD/YYYY, MM/DD, MM-DD
      let dateStr = line;
      if (/^\d{1,2}[\/-]\d{1,2}$/.test(line)) {
        // If year is missing, use current year
        const [month, day] = line.split(/[\/-]/).map(Number);
        const year = new Date().getFullYear();
        dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}T00:00:00`;
    }
    workoutDate = new Date(dateStr);

      // Handles LEG EXTENSIONS 1 leg
    } else if (
      /^(?=.*[A-Za-z])[A-Za-z0-9 ()]+$/i.test(line) &&
      !/^\d+[xX]\s*\d+/.test(line)
    ) {
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
  return [result, workoutDate];
}

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryResult, setQueryResult] = useState<WorkoutQueryResult[] | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"workout" | "sessions">("workout");
  const [activeMuscle, setActiveMuscle] = useState<string>(MUSCLE_GROUPS[0]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [muscleGroupRefresh, setMuscleGroupRefresh] = useState(Date.now());

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchSessions();
      setSessions(data.sessions || []);
    } catch (e) {
      setError(
        "Failed to fetch sessions from backend: " +
          (e instanceof Error ? e.message : String(e))
      );
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (activeTab === "sessions" && !sessions.length) {
      fetchSessions();
    }
  }, [activeTab]);

  // New API flow: handleQuery calls /query and sets normalized result
  const handleQuery = async (inputText: string) => {
    setLoading(true);
    setError("");
    setQueryResult(null);
    try {
      // Parse input before sending to /query
      const [parsedWorkout, workoutDate] = parseWorkoutInput(inputText);
      const data: WorkoutQueryResult[] = await queryWorkout(
        parsedWorkout,
        workoutDate
      );
      setQueryResult(data);
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
      setMuscleGroupRefresh(Date.now());
      await fetchSessions();
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
      <header className="App-header no-vertical-center redesigned-header">
        <div className="header-content">
          <h1 className="app-title">PowerAI</h1>
          <nav className="main-nav">
            <button
              className={"nav-btn" + (activeTab === "workout" ? " active" : "")}
              onClick={() => setActiveTab("workout")}
            >
              Workout
            </button>
            <button
              className={
                "nav-btn" + (activeTab === "sessions" ? " active" : "")
              }
              onClick={() => setActiveTab("sessions")}
            >
              Exercises
            </button>
          </nav>
        </div>
        <div className="main-content">
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
              muscleGroupRefresh={muscleGroupRefresh}
            />
          ) : (
            <ExerciseTabs
              loading={loading}
              muscleGroups={MUSCLE_GROUPS}
              activeMuscle={activeMuscle}
              setActiveMuscle={setActiveMuscle}
              sessions={sessions}
            />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
