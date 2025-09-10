import React from "react";
import { Notification } from "./Notification";
import { MuscleGroupLastWorkout } from "./MuscleGroupLastWorkout";
import { WorkoutQueryResult } from "../services/apiService";
import { QueryResultConfirmation } from "./QueryResultConfirmation";

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
      {showConfirmation && queryResult && (
        <QueryResultConfirmation
          handleQuery={handleQuery}
          queryResult={queryResult}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          setShowConfirmation={setShowConfirmation}
          setShowSuccess={setShowSuccess}
        />
      )}
      <MuscleGroupLastWorkout refresh={muscleGroupRefresh} />
    </div>
  );
};
