// --- Interfaces for queryWorkout response ---
export interface WorkoutSet {
  weight: number;
  reps: number;
  note: string;
}

export interface WorkoutQueryResult {
  name: string;
  date: string;
  location: string;
  primary_muscle: string;
  secondary_muscle: string | null;
  equipment: string;
  total_sets: number;
  total_reps: number;
  max_weight: number;
  total_volume: number;
  sets: WorkoutSet[];
}
const BACKEND_URL = "http://localhost:8000";

export async function fetchSessions() {
  try {
    const res = await fetch(`${BACKEND_URL}/sessions`, { method: "GET" });
    if (!res.ok) {
      let detail = "";
      try {
        const errJson = await res.json();
        detail = errJson.detail || JSON.stringify(errJson);
      } catch {}
      throw new Error(
        `Error: ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    throw error;
  }
}

export async function queryWorkout(
  parsedWorkout: any,
  date: string
): Promise<WorkoutQueryResult[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: parsedWorkout, date: date }),
    });
    if (!res.ok) {
      let detail = "";
      try {
        const errJson = await res.json();
        detail = errJson.detail || JSON.stringify(errJson);
      } catch {}
      throw new Error(
        `Error: ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`
      );
    }
    const json = await res.json();
    const result: WorkoutQueryResult[] = json.result;
    return result;
  } catch (error) {
    console.error("Failed to query workout:", error);
    throw error;
  }
}

export async function submitWorkout(normalized: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercises: normalized }),
    });
    if (!res.ok) {
      let detail = "";
      try {
        const errJson = await res.json();
        detail = errJson.detail || JSON.stringify(errJson);
      } catch {}
      throw new Error(
        `Error: ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to submit workout:", error);
    throw error;
  }
}

export async function fetchLastWorkoutByMuscle() {
  try {
    const res = await fetch(`${BACKEND_URL}/workouts/last-workout-by-muscle`, {
      method: "GET",
    });
    if (!res.ok) {
      let detail = "";
      try {
        const errJson = await res.json();
        detail = errJson.detail || JSON.stringify(errJson);
      } catch {}
      throw new Error(
        `Error: ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch recent workouts by muscle:", error);
    throw error;
  }
}
