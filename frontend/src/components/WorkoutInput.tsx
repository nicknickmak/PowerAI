import React from "react";
import { Notification } from "./Notification";
import { MuscleGroupLastWorkout } from "./MuscleGroupLastWorkout";
import { WorkoutQueryResult } from "../services/apiService";

interface WorkoutInputProps {
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  error: string;
  queryResult: WorkoutQueryResult[] | null;
  handleQuery: (input: string) => Promise<any>;
  handleConfirm: (normalized: any) => Promise<any>;
  handleCancel?: () => void;
  muscleGroupRefresh?: number;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({
  input,
  setInput,
  loading,
  error,
  queryResult,
  handleQuery,
  handleConfirm,
  handleCancel,
  muscleGroupRefresh,
}) => {
  const [showError, setShowError] = React.useState(true);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [localLoading, setLocalLoading] = React.useState(false);

  React.useEffect(() => {
    setShowError(!!error);
  }, [error]);

  React.useEffect(() => {
    if (queryResult && !error) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
    }
  }, [queryResult, error]);

  return (
    <div
      style={{
        position: "relative",
        background: "#181818",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        padding: 32,
        maxWidth: 600,
        margin: "32px auto",
        color: "#e7e7e7",
        fontFamily: "Inter, Arial, sans-serif",
        minHeight: 600,
      }}
    >
      {/* Error notification at top */}
      {error && showError && (
        <Notification
          type="error"
          message={error}
          onDismiss={() => setShowError(false)}
        />
      )}

      {/* Success notification at top */}
      {showSuccess && (
        <Notification
          type="success"
          message="Workout sent to backend successfully!"
          onDismiss={() => setShowSuccess(false)}
          top={error && showError ? 60 : 12}
        />
      )}
      {/* Loading spinner overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(24,24,24,0.85)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                border: "6px solid #444",
                borderTop: "6px solid #00df00",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: 12,
              }}
            />
            <span
              style={{ color: "#00df00", fontWeight: "bold", fontSize: 18 }}
            >
              Loading...
            </span>
          </div>
          <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
      )}
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>Workout Input</h1>
      <p style={{ fontSize: 16, marginBottom: 8 }}>Enter your workout below:</p>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <textarea
          rows={8}
          cols={40}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            "12/28\n\nINCLINE CHEST PRESS\n140X20\n150X12\n150X10\n100X8 superset\n\nTRICEP PULLDOWN"
          }
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #444",
            background: "#222",
            color: "#e7e7e7",
            padding: 12,
            fontSize: 15,
            marginBottom: 12,
            resize: "vertical",
            maxWidth: 420,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button
          onClick={async () => {
            setLocalLoading(true);
            await handleQuery(input);
            setLocalLoading(false);
          }}
          disabled={localLoading || loading}
          style={{
            background: "#00df00",
            color: "#222",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: localLoading || loading ? "not-allowed" : "pointer",
            opacity: localLoading || loading ? 0.6 : 1,
          }}
        >
          Parse Workout (AI)
        </button>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      {/* Error log box, aesthetic and expandable */}
      {error && (
        <details
          style={{
            background: "#2a1a1a",
            border: "1px solid #ff3333",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 18,
            color: "#ffb3b3",
            boxShadow: "0 2px 8px rgba(255,51,51,0.08)",
            fontFamily: "Fira Mono, monospace",
            fontSize: 15,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <summary
            style={{
              fontWeight: "bold",
              color: "#ff3333",
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            Error Details
          </summary>
          <pre
            style={{
              marginTop: 10,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error}
          </pre>
        </details>
      )}
      {/* Confirmation UI for normalized workout from /query */}
      {showConfirmation && queryResult != null && (
        <div
          style={{
            marginTop: 24,
            background: "#222",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,223,0,0.08)",
            padding: 24,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2 style={{ color: "#00df00", marginBottom: 12 }}>
            AI Normalized Workout
          </h2>
          {/* Organized grid display for normalized workout summary */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginBottom: 18,
            }}
          >
            {queryResult.map((ex: WorkoutQueryResult, i: number) => {
              return (
                <div
                  key={i}
                  style={{
                    background: "#181818",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,223,0,0.10)",
                    padding: 20,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  {/* column exercise details */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#00df00",
                        marginBottom: 8,
                      }}
                    >
                      {ex.name.replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Date:</span>{" "}
                      {ex.date
                        ? new Date(ex.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "-"}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Location:</span>{" "}
                      {ex.location}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Primary Muscle:</span>{" "}
                      {ex.primary_muscle}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Secondary Muscle:</span>{" "}
                      {ex.secondary_muscle ?? "-"}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Equipment:</span>{" "}
                      {ex.equipment}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Total Sets:</span>{" "}
                      {ex.total_sets}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Total Reps:</span>{" "}
                      {ex.total_reps}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Max Weight:</span>{" "}
                      {ex.max_weight}
                    </div>
                    <div
                      style={{
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#888" }}>Total Volume:</span>{" "}
                      {ex.total_volume}
                    </div>
                  </div>

                  {/* column sets details */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#00df00",
                        marginBottom: 8,
                      }}
                    >
                      Sets:
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        color: "#e7e7e7",
                        fontSize: 15,
                        marginBottom: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      {ex.sets.map((set, idx) => (
                        <li key={idx} style={{ marginBottom: 8 }}>
                          <span style={{ color: "#888" }}>Weight:</span>{" "}
                          {set.weight},
                          <span style={{ color: "#888", marginLeft: 8 }}>
                            Reps:
                          </span>{" "}
                          {set.reps}
                          {set.note && (
                            <span style={{ color: "#ffb300", marginLeft: 8 }}>
                              Note: {set.note}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={async () => {
                setLocalLoading(true);
                await handleConfirm(queryResult);
                setLocalLoading(false);
                setShowConfirmation(false);
                setShowSuccess(true);
              }}
              style={{
                background: "#00df00",
                color: "#222",
                border: "none",
                borderRadius: 6,
                padding: "8px 20px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: localLoading ? "not-allowed" : "pointer",
                opacity: localLoading ? 0.6 : 1,
              }}
              disabled={localLoading}
            >
              Confirm & Submit
            </button>
            <button
              onClick={() => {
                setShowConfirmation(false);
                if (handleCancel) handleCancel();
              }}
              style={{
                background: "#444",
                color: "#e7e7e7",
                border: "none",
                borderRadius: 6,
                padding: "8px 20px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <MuscleGroupLastWorkout refresh={muscleGroupRefresh} />
    </div>
  );
};
