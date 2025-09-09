// API service for backend communication

const BACKEND_URL = "http://localhost:8000";

export async function fetchExercises() {
  const res = await fetch(`${BACKEND_URL}/exercises`, { method: "GET" });
  return res.json();
}

export async function queryWorkout(parsedWorkout: any) {
  const res = await fetch(`${BACKEND_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: parsedWorkout }),
  });
  return res.json();
}

export async function submitWorkout(normalized: any) {
  const res = await fetch(`${BACKEND_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exercises: normalized }),
  });
  return res.json();
}
