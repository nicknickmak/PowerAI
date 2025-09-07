import React from "react";
import { Chart } from "react-google-charts";

const ExerciseChart: React.FC<{
  activeChart: "line" | "bar";
  lineData: any[];
  barData: any[];
}> = ({ activeChart, lineData, barData }) => (
  <div>
    {activeChart === "line" ? (
      <Chart
        chartType="LineChart"
        width={"500px"}
        height={"180px"}
        data={lineData}
        options={{
          backgroundColor: "#333",
          legend: {
            position: "bottom",
            textStyle: { color: "#e7e7e7" },
          },
          hAxis: {
            title: "Date",
            textStyle: { color: "#e7e7e7" },
            titleTextStyle: { color: "#e7e7e7" },
          },
          vAxes: {
            0: {
              title: "Weight",
              textStyle: { color: "#e7e7e7" },
              titleTextStyle: { color: "#e7e7e7" },
              minValue: 0,
            },
            1: {
              title: "Reps",
              textStyle: { color: "#e7e7e7" },
              titleTextStyle: { color: "#e7e7e7" },
              minValue: 0,
            },
          },
          series: {
            0: {
              targetAxisIndex: 0,
              color: "#00df00",
              dataLabel: "value",
            }, // Weight
            1: {
              targetAxisIndex: 1,
              color: "#ff3333",
              dataLabel: "value",
            }, // Reps
          },
          titleTextStyle: { color: "#e7e7e7" },
          annotations: {
            alwaysOutside: false,
            textStyle: {
              fontSize: 10,
              color: "#000",
            },
          },
        }}
      />
    ) : (
      <Chart
        chartType="ColumnChart"
        width={"500px"}
        height={"180px"}
        data={barData}
        options={{
          backgroundColor: "#333",
          legend: {
            position: "bottom",
            textStyle: { color: "#e7e7e7" },
          },
          hAxis: {
            title: "Date",
            textStyle: { color: "#e7e7e7" },
            titleTextStyle: { color: "#e7e7e7" },
          },
          vAxes: {
            0: {
              title: "Weight",
              textStyle: { color: "#e7e7e7" },
              titleTextStyle: { color: "#e7e7e7" },
              minValue: 0,
            },
            1: {
              title: "Reps",
              textStyle: { color: "#e7e7e7" },
              titleTextStyle: { color: "#e7e7e7" },
              minValue: 0,
            },
          },
          series: {
            0: {
              targetAxisIndex: 0,
              color: "#00bfff",
            }, // Weight
            1: {
              targetAxisIndex: 1,
              color: "#ff3333",
            }, // Reps
          },
          titleTextStyle: { color: "#e7e7e7" },
          bar: { groupWidth: "100%" },
          annotations: {
            alwaysOutside: false,
            stem: {
              length: 8,
            },
            textStyle: {
              fontSize: 10,
              bold: true,
            },
          },
        }}
      />
    )}
  </div>
);

export default ExerciseChart;
