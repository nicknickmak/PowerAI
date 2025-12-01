import ExerciseHeader from "./ExerciseHeader";
import ChartSwitcher from "./ChartSwitcher";
import { Line, Bar } from "react-chartjs-2";
import React from "react";
import { Session } from "./ExerciseTabs";
import styles from "./ExerciseCard.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart color variables (shared for both line and bar)
const COLOR_WEIGHT = "#3e5c76";
const COLOR_WEIGHT_BG = "rgba(62,92,118,0.18)";
const COLOR_REPS = "#00b88a";
const COLOR_REPS_BG = "rgba(0,184,138,0.18)";

const ExerciseCard: React.FC<{ sessions: Session[]; exerciseName: string }> = ({
  sessions,
  exerciseName,
}) => {
  const [activeChart, setActiveChart] = React.useState<"line" | "bar">("bar");
  // Aggregate all sets for this exercise across sessions
  const allSetsRaw = sessions.flatMap((session) =>
    session.sets
      .filter((set) => set.exercise === exerciseName)
      .map((set) => ({ ...set, date: session.date }))
  );
  // Only keep the set with the highest weight per date
  const setsByDate = new Map<string, (typeof allSetsRaw)[0]>();
  allSetsRaw.forEach((set) => {
    const existing = setsByDate.get(set.date);
    if (!existing || set.weight > existing.weight) {
      setsByDate.set(set.date, set);
    }
  });
  const allSets = Array.from(setsByDate.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formattedName = formatExerciseName(exerciseName);

  const lineData = [
    ["Date", "Weight", "Reps"],
    ...allSets.map((set) => [set.date, set.weight, set.reps]),
  ];
  const barData = [
    ["Date", "Weight", { role: "annotation" }, "Reps", { role: "annotation" }],
    ...allSets.map((set) => [
      set.date,
      set.weight,
      String(set.weight),
      set.reps,
      String(set.reps),
    ]),
  ];
  return (
    <div className={styles["exercise-card"]}>
      <div className={styles["exercise-card-header"]}>
        <ExerciseHeader
          name={formattedName}
          lastDate={allSets.length > 0 ? allSets[allSets.length - 1].date : ""}
        />
        <ChartSwitcher
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />
      </div>
      <div className={styles["exercise-card-chart"]}>
        {allSets.length > 0 ? (
          (() => {
            let chartData;
            // Helper to format date string to MM/DD
            const formatDate = (dateStr: string) => {
              const d = new Date(dateStr);
              if (isNaN(d.getTime())) return dateStr;
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              return `${mm}/${dd}`;
            };

            if (activeChart === "line") {
              const labels = lineData
                .slice(1)
                .map((row) => formatDate(String(row[0])));
              const weights = lineData.slice(1).map((row) => row[1]);
              const reps = lineData.slice(1).map((row) => row[2]);
              chartData = {
                labels,
                datasets: [
                  {
                    label: "Weight",
                    data: weights,
                    borderColor: COLOR_WEIGHT,
                    backgroundColor: COLOR_WEIGHT_BG,
                  },
                  {
                    label: "Reps",
                    data: reps,
                    borderColor: COLOR_REPS,
                    backgroundColor: COLOR_REPS_BG,
                  },
                ],
              };
            } else {
              const labels = barData
                .slice(1)
                .map((row) => formatDate(String(row[0])));
              const weights = barData.slice(1).map((row) => row[1]);
              const reps = barData.slice(1).map((row) => row[3]);
              chartData = {
                labels,
                datasets: [
                  {
                    label: "Weight",
                    data: weights,
                    backgroundColor: COLOR_WEIGHT,
                  },
                  {
                    label: "Reps",
                    data: reps,
                    backgroundColor: COLOR_REPS,
                  },
                ],
              };
            }
            const chartOptions = {
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                  labels: {
                    color: "#232946",
                    font: { size: 14, family: "Inter, Arial, sans-serif" },
                  },
                },
                title: {
                  display: true,
                  text: formattedName + " Progress",
                  color: "#232946",
                  font: { size: 18, weight: "bold" as const },
                },
              },
              scales: {
                y: {
                  type: "linear" as const,
                  display: true,
                  position: "left" as const,
                  title: {
                    display: true,
                    text: "Weight",
                    color: "#232946",
                  },
                  ticks: { color: "#232946" },
                  grid: { color: "#e0e3ea" },
                },
                y1: {
                  type: "linear" as const,
                  display: true,
                  position: "right" as const,
                  grid: {
                    drawOnChartArea: false,
                    color: "#e0e3ea",
                  },
                  title: {
                    display: true,
                    text: "Reps",
                    color: "#232946",
                  },
                  ticks: { color: "#232946" },
                },
                x: {
                  ticks: { color: "#232946" },
                  grid: { color: "#e0e3ea" },
                },
              },
            };
            return (
              <div className={styles["exercise-card-chart-inner"]}>
                {activeChart === "line" ? (
                  <Line
                    data={{
                      ...chartData,
                      datasets: [
                        {
                          ...chartData.datasets[0],
                          yAxisID: "y",
                        },
                        {
                          ...chartData.datasets[1],
                          yAxisID: "y1",
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      //   maintainAspectRatio: false,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Bar
                    data={{
                      ...chartData,
                      datasets: [
                        {
                          ...chartData.datasets[0],
                          yAxisID: "y",
                        },
                        {
                          ...chartData.datasets[1],
                          yAxisID: "y1",
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </div>
            );
          })()
        ) : (
          <div className={styles["exercise-card-empty"]}>
            <span>No data available for this exercise.</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format exercise names
function formatExerciseName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default ExerciseCard;
