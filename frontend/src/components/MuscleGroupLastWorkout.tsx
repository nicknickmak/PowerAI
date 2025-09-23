import React from "react";
import {
  fetchLastWorkoutByMuscle,
  LastWorkout,
  LastWorkoutResponse,
} from "../services/apiService";

function getDaysSince(date: Date | null): number | null {
  if (!date) return null;
  const now = new Date();
  // Get local calendar day for now and date
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor(
    (nowDay.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? diff : null;
}

export const MuscleGroupLastWorkout: React.FC<{ refresh?: number }> = ({
  refresh,
}) => {
  const [lastWorkoutByMuscle, setLastWorkoutByMuscle] = React.useState<Record<
    string,
    LastWorkout
  > | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    fetchLastWorkoutByMuscle()
      .then((data: LastWorkoutResponse) => {
        setLastWorkoutByMuscle(data.last_workout_by_muscle || {});
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch last workout by muscle.");
        setLoading(false);
      });
  }, [refresh]);

  const muscleNames = Object.keys(lastWorkoutByMuscle || {});

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
            if (!lastWorkoutByMuscle) return null;
            const info: LastWorkout | null = lastWorkoutByMuscle[muscle];
            if (!info) return null;
            const days = getDaysSince(info?.session_date || null);
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
                    margin: "8px 0 8px 0",
                    padding: isExpanded ? "12px 16px" : "0 16px",
                    color: "#e7e7e7",
                    fontWeight: 400,
                    fontSize: 15,
                    maxHeight: isExpanded ? 500 : 0,
                    opacity: isExpanded ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1), padding 0.2s cubic-bezier(0.4,0,0.2,1)",
                    textAlign: "left",
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
                        {info.primary_muscle || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Secondary Muscle:</strong>{" "}
                        {info.secondary_muscle || "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Date:</strong>{" "}
                        {info.session_date
                          ? new Date(info.session_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )
                          : "-"}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Top Set:</strong>{" "}
                        <span style={{ margin: "6px 0 0 0", padding: 0 }}>
                          {info.top_set ? (
                            <>
                              <span style={{ color: "#00df00" }}>Weight:</span>{" "}
                              {info.top_set.weight ?? "-"} &nbsp;
                              <span style={{ color: "#00df00" }}>
                                Reps:
                              </span>{" "}
                              {info.top_set.reps ?? "-"}
                            </>
                          ) : (
                            <>-</>
                          )}
                        </span>
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
