import React from "react";
import { Notification } from "./Notification";
import { MuscleGroupLastWorkout } from "./MuscleGroupLastWorkout";
import { WorkoutQueryResult } from "../services/apiService";
import { QueryResultConfirmation } from "./QueryResultConfirmation";
import styles from "./WorkoutInput.module.css";

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
    <div className={styles["workout-input"]}>
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
        <div className={styles["workout-input-loading-overlay"]}>
          <div className={styles["workout-input-loading-content"]}>
            <div className={styles["workout-input-spinner"]} />
            <span className={styles["workout-input-loading-text"]}>
              Loading...
            </span>
          </div>
        </div>
      )}
      <h1 className={styles["workout-input-title"]}>Workout Input</h1>
      <p className={styles["workout-input-desc"]}>Enter your workout below:</p>
      <div className={styles["workout-input-textarea-row"]}>
        <textarea
          rows={8}
          cols={40}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            "12/28\n\nINCLINE CHEST PRESS\n140X20\n150X12\n150X10\n100X8 superset\n\nTRICEP PULLDOWN"
          }
          className={styles["workout-input-textarea"]}
        />
      </div>
      <div className={styles["workout-input-btn-row"]}>
        <button
          onClick={async () => {
            setLocalLoading(true);
            await handleQuery(input);
            setLocalLoading(false);
          }}
          disabled={localLoading || loading}
          className={styles["workout-input-btn"]}
        >
          Parse Workout (AI)
        </button>
      </div>
      {error && <div className={styles["workout-input-error"]}>{error}</div>}

      {/* Error log box, aesthetic and expandable */}
      {error && (
        <details className={styles["workout-input-details"]}>
          <summary className={styles["workout-input-details-summary"]}>
            Error Details
          </summary>
          <pre className={styles["workout-input-details-pre"]}>{error}</pre>
        </details>
      )}

      {/* Confirmation dialog for parsed workout */}
      {showConfirmation && queryResult && (
        <QueryResultConfirmation
          queryResult={queryResult}
          handleQuery={handleQuery}
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
