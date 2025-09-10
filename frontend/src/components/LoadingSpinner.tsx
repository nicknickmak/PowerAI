import React from "react";

const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120,
      fontSize: 20,
      color: "#00df00",
      fontWeight: 700,
      letterSpacing: 1,
    }}
  >
    <div className="spinner" style={{ marginBottom: 16 }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#00df00"
          strokeWidth="4"
          opacity="0.2"
        />
        <path
          d="M38 20a18 18 0 1 1-18-18"
          stroke="#00df00"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <span>{message}</span>
  </div>
);

export default LoadingSpinner;
