const BACKEND_URL = "http://localhost:8000";

export async function fetchSessions() {
  try {
    const res = await fetch(`${BACKEND_URL}/sessions`, { method: "GET" });
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    throw error;
  }
}

export async function queryWorkout(parsedWorkout: any, date: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: parsedWorkout, date: date }),
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
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
      throw new Error(`Error: ${res.status} ${res.statusText}`);
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
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch recent workouts by muscle:", error);
    throw error;
  }
}
