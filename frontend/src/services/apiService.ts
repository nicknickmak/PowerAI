// --- Model for fetchLastWorkoutByMuscle response ---
export interface LastWorkoutResponse {
  last_workout_by_muscle: Record<string, LastWorkout>;
}

export interface LastWorkout {
  session_date: Date;
  location: string;
  exercise: string;
  equipment: string;
  primary_muscle: string;
  secondary_muscle: string | null;
  top_set: WorkoutSet | null;
}
// --- Interfaces for queryWorkout response ---
export interface WorkoutSet {
  weight: number;
  reps: number;
  note: string;
}

export interface WorkoutQueryResult {
  name: string;
  date: Date;
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

// Use environment variables for backend URLs
const BACKEND_CORE_URL = process.env.REACT_APP_CORE_API_URL;
const BACKEND_AI_URL = process.env.REACT_APP_AI_API_URL;

export async function fetchSessions() {
  try {
    const res = await fetch(`${BACKEND_CORE_URL}/sessions`, { method: "GET" });
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
  date: Date
): Promise<WorkoutQueryResult[]> {
  try {
    const res = await fetch(`${BACKEND_AI_URL}/query`, {
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
    const result: WorkoutQueryResult[] = json.result.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }));
    return result;
  } catch (error) {
    console.error("Failed to query workout:", error);
    throw error;
  }
}

export async function submitWorkout(normalized: any) {
  try {
    const res = await fetch(`${BACKEND_CORE_URL}/submit`, {
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

export async function fetchLastWorkoutByMuscle(): Promise<LastWorkoutResponse> {
  try {
    const res = await fetch(
      `${BACKEND_CORE_URL}/workouts/last-workout-by-muscle`,
      {
        method: "GET",
      }
    );
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
    // Convert session_date to local Date object for each entry, forcing UTC if no timezone
    Object.values(json.last_workout_by_muscle).forEach((entry) => {
      let dateStr = String((entry as LastWorkout).session_date);
      // If date string does not have a timezone, append 'Z' to treat as UTC
      if (!dateStr.match(/[zZ]|[+-]\d{2}:?\d{2}$/)) {
        dateStr = dateStr + "Z";
      }
      (entry as LastWorkout).session_date = new Date(dateStr);
    });
    return json;
  } catch (error) {
    console.error("Failed to fetch recent workouts by muscle:", error);
    throw error;
  }
}
