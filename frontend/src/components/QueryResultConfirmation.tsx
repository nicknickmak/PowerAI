import React from "react";
import { WorkoutQueryResult } from "../services/apiService";
import styles from "./QueryResultConfirmation.module.css";

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
    <div className={styles["qrc-container"]}>
      <h2 className={styles["qrc-title"]}>AI Normalized Workout</h2>
      {/* Organized grid display for normalized workout summary */}
      <div className={styles["qrc-list"]}>
        {queryResult.map((ex: WorkoutQueryResult, i: number) => (
          <div key={i} className={styles["qrc-card"]}>
            {/* column exercise details */}
            <div className={styles["qrc-col"]}>
              <div className={styles["qrc-ex-title"]}>
                {ex.name.replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Date:</span>{" "}
                {ex.date
                  ? `${
                      ex.date.getMonth() + 1
                    }/${ex.date.getDate()}/${ex.date.getFullYear()}`
                  : "-"}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Location:</span>{" "}
                {ex.location}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Primary Muscle:</span>{" "}
                {ex.primary_muscle}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>
                  Secondary Muscle:
                </span>{" "}
                {ex.secondary_muscle ?? "-"}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Equipment:</span>{" "}
                {ex.equipment}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Total Sets:</span>{" "}
                {ex.total_sets}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Total Reps:</span>{" "}
                {ex.total_reps}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Max Weight:</span>{" "}
                {ex.max_weight}
              </div>
              <div className={styles["qrc-ex-value"]}>
                <span className={styles["qrc-ex-label"]}>Total Volume:</span>{" "}
                {ex.total_volume}
              </div>
            </div>
            {/* column sets details */}
            <div className={styles["qrc-col"]}>
              <div className={styles["qrc-ex-title"]}>Sets:</div>
              <ul className={styles["qrc-set-list"]}>
                {ex.sets.map((set, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <span className={styles["qrc-ex-label"]}>Weight:</span>{" "}
                    {set.weight},
                    <span
                      className={styles["qrc-ex-label"]}
                      style={{ marginLeft: 8 }}
                    >
                      Reps:
                    </span>{" "}
                    {set.reps}
                    {set.note && (
                      <span className={styles["qrc-set-note"]}>
                        Note: {set.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className={styles["qrc-btn-row"]}>
        <button
          onClick={async () => {
            setLocalLoading(true);
            await handleConfirm(queryResult);
            setLocalLoading(false);
            setShowConfirmation(false);
            setShowSuccess(true);
          }}
          className={styles["qrc-btn-confirm"]}
          disabled={localLoading}
        >
          Confirm & Submit
        </button>
        <button
          onClick={() => {
            setShowConfirmation(false);
            if (handleCancel) handleCancel();
          }}
          className={styles["qrc-btn-cancel"]}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
