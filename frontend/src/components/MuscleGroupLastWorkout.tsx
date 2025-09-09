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

export const MuscleGroupLastWorkout: React.FC<{ refresh?: number }> = ({
  refresh,
}) => {
  const [recentByMuscle, setRecentByMuscle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<string | null>(null);

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
  }, [refresh]);

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
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {muscleNames.map((muscle) => {
            const info = recentByMuscle[muscle];
            const days = getDaysSince(info.lastDate);
            const isExpanded = expanded === muscle;
            return (
              <li
                key={muscle}
                style={{
                  background: "#333",
                  borderRadius: 6,
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#e7e7e7",
                  cursor: "pointer",
                  boxShadow: isExpanded
                    ? "0 2px 12px rgba(0,223,0,0.10)"
                    : undefined,
                  transition: "box-shadow 0.2s",
                }}
                onClick={() => setExpanded(isExpanded ? null : muscle)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 16px",
                  }}
                >
                  <span
                    style={{
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        transition: "transform 0.2s",
                        transform: isExpanded
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                        fontSize: 13,
                        color: "#e7e7e7",
                        marginRight: 2,
                      }}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      ▶
                    </span>
                    {muscle}
                  </span>
                  <span
                    style={{
                      color: days === null ? "#ff3333" : "#00df00",
                      fontSize: 18,
                    }}
                  >
                    {days === null ? "No data" : days}
                  </span>
                </div>
                <div
                  style={{
                    background: "#222",
                    borderRadius: 6,
                    margin: "8px 16px 8px 16px",
                    padding: isExpanded ? "12px 16px" : "0 16px",
                    color: "#e7e7e7",
                    fontWeight: 400,
                    fontSize: 15,
                    maxHeight: isExpanded ? 500 : 0,
                    opacity: isExpanded ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1), padding 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  aria-hidden={!isExpanded}
                >
                  {
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Exercise:</strong> {info.exercise || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Equipment:</strong> {info.equipment || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Primary Muscle:</strong>{" "}
                        {info.primaryMuscle || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Secondary Muscle:</strong>{" "}
                        {info.secondaryMuscle || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Last Date:</strong> {info.lastDate || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Sets:</strong>
                        <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                          {Array.isArray(info.sets) && info.sets.length > 0 ? (
                            info.sets.map((set: any, idx: number) => (
                              <li key={idx} style={{ marginBottom: 4 }}>
                                <span style={{ color: "#00df00" }}>
                                  Weight:
                                </span>{" "}
                                {set.weight ?? "-"} &nbsp;
                                <span style={{ color: "#00df00" }}>
                                  Reps:
                                </span>{" "}
                                {set.reps ?? "-"}
                              </li>
                            ))
                          ) : (
                            <li>-</li>
                          )}
                        </ul>
                      </div>
                    </>
                  }
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
