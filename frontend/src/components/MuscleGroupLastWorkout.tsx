import React from "react";
import { fetchRecentByMuscle } from "../services/apiService";

function getDaysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? diff : null;
}

export const MuscleGroupLastWorkout: React.FC = () => {
  const [recentByMuscle, setRecentByMuscle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    fetchRecentByMuscle()
      .then((data) => {
        setRecentByMuscle(data.recent_by_muscle || {});
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch recent workouts by muscle.");
        setLoading(false);
      });
  }, []);

  const muscleNames = Object.keys(recentByMuscle || {});

  return (
    <div style={{ marginTop: 32 }}>
      <h2
        style={{
          borderBottom: "1px solid #333",
          paddingBottom: 4,
          marginBottom: 8,
        }}
      >
        Days Since Last Workout (per muscle group)
      </h2>
      {loading ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 17,
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          Loading...
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            color: "#ff3333",
            fontSize: 17,
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          {error}
        </div>
      ) : muscleNames.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 17,
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          No data
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxWidth: 320,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {muscleNames.map((muscle) => {
            const info = recentByMuscle[muscle];
            const days = getDaysSince(info.lastDate);
            return (
              <li
                key={muscle}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#333",
                  borderRadius: 6,
                  padding: "8px 16px",
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#e7e7e7",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{muscle}</span>
                <span
                  style={{
                    color: days === null ? "#ff3333" : "#00df00",
                    fontSize: 18,
                  }}
                >
                  {days === null ? "No data" : days}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
