import React from "react";

export type NotificationType = "success" | "info" | "error" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  onDismiss: () => void;
  style?: React.CSSProperties;
  top?: number;
}

const typeStyles: Record<
  NotificationType,
  { bg: string; border: string; color: string; label: string }
> = {
  success: {
    bg: "#1a2a1a",
    border: "#00df00",
    color: "#b3ffb3",
    label: "Success:",
  },
  info: {
    bg: "#1a1a2a",
    border: "#3399ff",
    color: "#b3d1ff",
    label: "Info:",
  },
  error: {
    bg: "#2a1a1a",
    border: "#ff3333",
    color: "#ffb3b3",
    label: "Error:",
  },
  warning: {
    bg: "#2a2a1a",
    border: "#ffd700",
    color: "#fff3b3",
    label: "Warning:",
  },
};

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onDismiss,
  style,
  top = 12,
}) => {
  if (!message) return null;
  const { bg, border, color, label } = typeStyles[type];
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: "translateX(-50%)",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        color,
        boxShadow: `0 2px 8px ${border}33`,
        fontFamily: "Fira Mono, monospace",
        fontSize: 15,
        minWidth: 320,
        maxWidth: 520,
        zIndex: 20,
        padding: "14px 24px 14px 18px",
        display: "flex",
        alignItems: "center",
        animation: "fadeInDown 0.5s",
        ...style,
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          color: border,
          fontSize: 17,
          marginRight: 12,
        }}
      >
        {label}
      </span>
      <span
        style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {message}
      </span>
      <button
        onClick={onDismiss}
        style={{
          marginLeft: 16,
          background: "none",
          border: "none",
          color: border,
          fontWeight: "bold",
          fontSize: 18,
          cursor: "pointer",
          padding: 0,
        }}
        aria-label={`Dismiss ${type} notification`}
      >
        ×
      </button>
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-24px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
