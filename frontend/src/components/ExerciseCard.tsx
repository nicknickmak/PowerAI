import ExerciseHeader from "./ExerciseHeader";
import ChartSwitcher from "./ChartSwitcher";
import { Line, Bar } from "react-chartjs-2";
import React from "react";
import { Session } from "./ExerciseTabs";

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
const COLOR_WEIGHT = "#00df00";
const COLOR_WEIGHT_BG = "rgba(0,223,0,0.2)";
const COLOR_REPS = "#33adffff";
const COLOR_REPS_BG = "rgba(255,51,51,0.2)";

const ExerciseCard: React.FC<{ sessions: Session[]; exerciseName: string }> = ({
  sessions,
  exerciseName,
}) => {
  const [activeChart, setActiveChart] = React.useState<"line" | "bar">("bar");
  // Aggregate all sets for this exercise across sessions
  const allSets = sessions.flatMap((session) =>
    session.sets
      .filter((set) => set.exercise === exerciseName)
      .map((set) => ({ ...set, date: session.date }))
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
    <div
      style={{
        background: "#222",
        margin: "8px 0",
        padding: 8,
        borderRadius: 8,
        width: "100%",
        maxWidth: "clamp(320px, 100vw, 700px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <ExerciseHeader
          name={formattedName}
          lastDate={allSets.length > 0 ? allSets[allSets.length - 1].date : ""}
        />
        <ChartSwitcher
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />
      </div>
      <div>
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
                },
                title: {
                  display: true,
                  text: formattedName + " Progress",
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
                  },
                },
                y1: {
                  type: "linear" as const,
                  display: true,
                  position: "right" as const,
                  grid: {
                    drawOnChartArea: false,
                  },
                  title: {
                    display: true,
                    text: "Reps",
                  },
                },
              },
            };
            return (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ width: "100%", height: "min(40vw, 260px)" }}>
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
              </div>
            );
          })()
        ) : (
          <div
            style={{
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
