import React from "react";
import styles from "./ExerciseHeader.module.css";

const ExerciseHeader: React.FC<{ name: string; lastDate: string }> = ({
  name,
  lastDate,
}) => (
  <div className={styles["exercise-header"]}>
    <span className={styles["exercise-header-title"]}>{name}</span>
    <span className={styles["exercise-header-date"]}>
      {(() => {
        const dateObj = new Date(lastDate);
        const today = new Date();
        const diffDays = Math.floor(
          (today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
        );
        return `Last: ${dateObj.toLocaleDateString()} (${diffDays}d ago)`;
      })()}
    </span>
  </div>
);

export default ExerciseHeader;
