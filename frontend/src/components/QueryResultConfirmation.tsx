import React from "react";
import { WorkoutQueryResult } from "../services/apiService";

interface QueryResultConfirmationProps {
  queryResult: WorkoutQueryResult[];
  handleQuery: (input: string) => Promise<any>;
  handleConfirm: (normalized: any) => Promise<any>;
  handleCancel?: () => void;
  setShowConfirmation: (val: boolean) => void;
  setShowSuccess: (val: boolean) => void;
}

export const QueryResultConfirmation: React.FC<
  QueryResultConfirmationProps
> = ({
  queryResult,
  handleConfirm,
  handleCancel,
  setShowConfirmation,
  setShowSuccess,
}: QueryResultConfirmationProps) => {
  const [localLoading, setLocalLoading] = React.useState(false);

  return (
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
                  <span style={{ color: "#888" }}>Location:</span> {ex.location}
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
  );
};
