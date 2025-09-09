import React from "react";
import { Notification } from "./Notification";
import { MuscleGroupLastWorkout } from "./MuscleGroupLastWorkout";

interface WorkoutInputProps {
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  error: string;
  queryResult: any;
  handleQuery: (input: string) => Promise<any>;
  handleConfirm: (normalized: any) => Promise<any>;
  handleCancel?: () => void;
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
            "INCLINE CHEST PRESS\n140X20\n150X12\n150X10\n100X8 superset\n\nTRICEP PULLDOWN"
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
      {showConfirmation && queryResult && (
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
          {Array.isArray(queryResult) ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
                marginBottom: 18,
              }}
            >
              {queryResult.map((ex: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: "#181818",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,223,0,0.10)",
                    padding: 20,
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
                    {ex.name || ex.exercise || `Exercise ${i + 1}`}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ color: "#e7e7e7", fontSize: 15 }}>
                      <span style={{ color: "#888" }}>Sets:</span>{" "}
                      <span style={{ fontWeight: 600 }}>
                        {ex.sets_count ?? ex.sets ?? "-"}
                      </span>
                    </div>
                    <div style={{ color: "#e7e7e7", fontSize: 15 }}>
                      <span style={{ color: "#888" }}>Reps:</span>{" "}
                      <span style={{ fontWeight: 600 }}>{ex.reps ?? "-"}</span>
                    </div>
                    <div style={{ color: "#e7e7e7", fontSize: 15 }}>
                      <span style={{ color: "#888" }}>Max Weight:</span>{" "}
                      <span style={{ fontWeight: 600 }}>
                        {ex.max_weight ?? ex.maxWeight ?? "-"}
                      </span>
                    </div>
                    <div style={{ color: "#e7e7e7", fontSize: 15 }}>
                      <span style={{ color: "#888" }}>Total Volume:</span>{" "}
                      <span style={{ fontWeight: 600 }}>
                        {ex.total_volume ?? ex.totalVolume ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : typeof queryResult === "string" ? (
            <div
              style={{
                background: "#181818",
                color: "#e7e7e7",
                borderRadius: 10,
                padding: 18,
                fontSize: 16,
                marginBottom: 18,
                textAlign: "center",
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
            ></div>
          ) : (
            <div
              style={{
                background: "#181818",
                color: "#e7e7e7",
                borderRadius: 10,
                padding: 18,
                marginBottom: 18,
                boxShadow: "0 2px 8px rgba(0,223,0,0.08)",
                fontSize: 15,
                maxWidth: 480,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Object.entries(queryResult).map(([key, value], idx) => {
                  let renderedValue;
                  if (typeof value === "object") {
                    renderedValue = JSON.stringify(value, null, 2);
                  } else if (typeof value === "string") {
                    renderedValue = value
                      .split("|")
                      .map((part: string, i: number) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: 6,
                            textAlign: "left",
                            paddingLeft: 0,
                          }}
                        >
                          {part.trim()}
                        </div>
                      ));
                  } else {
                    renderedValue = String(value);
                  }
                  return (
                    <li
                      key={idx}
                      style={{
                        marginBottom: 12,
                        paddingBottom: 8,
                        borderBottom: "1px solid #333",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          color: "#00df00",
                          fontWeight: "bold",
                          minWidth: 110,
                          fontSize: 16,
                          textTransform: "capitalize",
                        }}
                      >
                        {key}:
                      </span>
                      <span
                        style={{
                          color: "#e7e7e7",
                          fontSize: 15,
                          wordBreak: "break-word",
                          flex: 1,
                        }}
                      >
                        {renderedValue}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={async () => {
                setLocalLoading(true);
                const exercises = Array.isArray(queryResult)
                  ? queryResult
                  : queryResult.result;
                await handleConfirm(exercises);
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
      <MuscleGroupLastWorkout />
    </div>
  );
};
