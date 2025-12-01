import React, { useEffect, useState } from "react";
import { fetchLastWorkoutByMuscle, LastWorkout } from "../services/apiService";
import styles from "./MuscleGroupLastWorkout.module.css";

interface MuscleGroupLastWorkoutProps {
  refresh?: number;
}

export const MuscleGroupLastWorkout: React.FC<MuscleGroupLastWorkoutProps> = ({
  refresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [muscleData, setMuscleData] = useState<
    Record<string, LastWorkout | null>
  >({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchLastWorkoutByMuscle()
      .then((data) => {
        setMuscleData(data.last_workout_by_muscle);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch last workout data.");
        setMuscleData({});
      })
      .finally(() => setLoading(false));
  }, [refresh]);
  const sortedMuscles = Object.entries(muscleData)
    .map(([muscle, info]) => {
      let days = null;
      if (info && info.session_date) {
        const lastDate = new Date(info.session_date);
        const today = new Date();
        days = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      }
      return { muscle, info, days };
    })
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  return (
    <div className={styles["mglw-container"]}>
      <h2 className={styles["mglw-title"]}>
        Days Since Last Workout (per muscle group)
      </h2>
      {loading ? (
        <div className={styles["mglw-loading"]}>Loading...</div>
      ) : error ? (
        <div className={styles["mglw-error"]}>{error}</div>
      ) : sortedMuscles.length === 0 ? (
        <div className={styles["mglw-nodata"]}>No data</div>
      ) : (
        <ul className={styles["mglw-list"]}>
          {sortedMuscles.map(({ muscle, info, days }) => {
            if (!info) return null;
            const isExpanded = expanded === muscle;
            const isWorkoutToday = days === 0;
            return (
              <li
                key={muscle}
                className={`${styles["mglw-item"]} ${
                  isWorkoutToday ? styles["mglw-item-today"] : ""
                } ${isExpanded ? styles["mglw-item-expanded"] : ""}`}
                onClick={() => setExpanded(isExpanded ? null : muscle)}
              >
                <div className={styles["mglw-row"]}>
                  <span className={styles["mglw-muscle"]}>
                    <span
                      className={`${styles["mglw-arrow"]} ${
                        isExpanded ? styles["mglw-arrow-expanded"] : ""
                      }`}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      ▶
                    </span>
                    {muscle}
                  </span>
                  <span
                    className={
                      days === null
                        ? styles["mglw-days-nodata"]
                        : isWorkoutToday
                        ? styles["mglw-days-today"]
                        : styles["mglw-days-normal"]
                    }
                  >
                    {days === null ? "No data" : days}
                  </span>
                </div>
                <div
                  className={`${styles["mglw-details"]} ${
                    isExpanded ? styles["mglw-details-expanded"] : ""
                  }`}
                  aria-hidden={!isExpanded ? "true" : "false"}
                >
                  <div className={styles["mglw-details-row"]}>
                    <strong>Exercise:</strong> {info.exercise || "-"}
                  </div>
                  <div className={styles["mglw-details-row"]}>
                    <strong>Equipment:</strong> {info.equipment || "-"}
                  </div>
                  <div className={styles["mglw-details-row"]}>
                    <strong>Primary Muscle:</strong>{" "}
                    {info.primary_muscle || "-"}
                  </div>
                  <div className={styles["mglw-details-row"]}>
                    <strong>Secondary Muscle:</strong>{" "}
                    {info.secondary_muscle || "-"}
                  </div>
                  <div className={styles["mglw-details-row"]}>
                    <strong>Date:</strong>{" "}
                    {info.session_date
                      ? new Date(info.session_date).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "2-digit", day: "2-digit" }
                        )
                      : "-"}
                  </div>
                  <div className={styles["mglw-details-row"]}>
                    <strong>Top Set:</strong>{" "}
                    <span>
                      {info.top_set ? (
                        <>
                          <span
                            className={
                              isWorkoutToday
                                ? styles["mglw-topset-label-today"]
                                : styles["mglw-topset-label"]
                            }
                          >
                            Weight:
                          </span>{" "}
                          {info.top_set.weight ?? "-"} &nbsp;
                          <span
                            className={
                              isWorkoutToday
                                ? styles["mglw-topset-label-today"]
                                : styles["mglw-topset-label"]
                            }
                          >
                            Reps:
                          </span>{" "}
                          {info.top_set.reps ?? "-"}
                        </>
                      ) : (
                        <>-</>
                      )}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
