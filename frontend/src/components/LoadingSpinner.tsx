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
      color: "#3e5c76",
      fontWeight: 700,
      letterSpacing: 1,
      fontFamily: "Inter, Arial, sans-serif",
    }}
  >
    <div className="spinner" style={{ marginBottom: 16 }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#3e5c76"
          strokeWidth="4"
          opacity="0.18"
        />
        <path
          d="M38 20a18 18 0 1 1-18-18"
          stroke="#3e5c76"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <span style={{ color: "#232946", fontWeight: 600 }}>{message}</span>
  </div>
);

export default LoadingSpinner;
