import React from "react";

interface WorkoutInputProps {
  input: string;
  setInput: (val: string) => void;
  handleParse: () => void;
  handleSubmit: () => void;
  handleSendWorkout: () => void;
  loading: boolean;
  parsed: any[];
  error: string;
  stats: any;
  backendResult: any;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({
  input,
  setInput,
  handleParse,
  handleSubmit,
  handleSendWorkout,
  loading,
  parsed,
  error,
  stats,
  backendResult,
}) => {
  const [showError, setShowError] = React.useState(true);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    setShowError(!!error);
  }, [error]);

  React.useEffect(() => {
    if (backendResult && !error) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [backendResult, error]);

  return (
    <div
      style={{
        position: "relative",
        background: "#181818",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        padding: 32,
        maxWidth: 600,
        margin: "32px auto",
        color: "#e7e7e7",
        fontFamily: "Inter, Arial, sans-serif",
        minHeight: 600,
      }}
    >
      {/* Error notification at top */}
      {error && showError && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2a1a1a",
            border: "1px solid #ff3333",
            borderRadius: 10,
            color: "#ffb3b3",
            boxShadow: "0 2px 8px rgba(255,51,51,0.18)",
            fontFamily: "Fira Mono, monospace",
            fontSize: 15,
            minWidth: 320,
            maxWidth: 520,
            zIndex: 20,
            padding: "14px 24px 14px 18px",
            display: "flex",
            alignItems: "center",
            animation: "fadeInDown 0.5s",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#ff3333",
              fontSize: 17,
              marginRight: 12,
            }}
          >
            Error:
          </span>
          <span
            style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {error}
          </span>
          <button
            onClick={() => setShowError(false)}
            style={{
              marginLeft: 16,
              background: "none",
              border: "none",
              color: "#ff3333",
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Dismiss error notification"
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
      )}

      {/* Success notification at top */}
      {showSuccess && (
        <div
          style={{
            position: "absolute",
            top: error && showError ? 56 : 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a2a1a",
            border: "1px solid #00df00",
            borderRadius: 10,
            color: "#b3ffb3",
            boxShadow: "0 2px 8px rgba(0,223,0,0.18)",
            fontFamily: "Fira Mono, monospace",
            fontSize: 15,
            minWidth: 320,
            maxWidth: 520,
            zIndex: 20,
            padding: "14px 24px 14px 18px",
            display: "flex",
            alignItems: "center",
            animation: "fadeInDown 0.5s",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#00df00",
              fontSize: 17,
              marginRight: 12,
            }}
          >
            Success:
          </span>
          <span
            style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            Workout sent to backend successfully!
          </span>
          <button
            onClick={() => setShowSuccess(false)}
            style={{
              marginLeft: 16,
              background: "none",
              border: "none",
              color: "#00df00",
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Dismiss success notification"
          >
            ×
          </button>
        </div>
      )}
      {/* Loading spinner overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(24,24,24,0.85)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                border: "6px solid #444",
                borderTop: "6px solid #00df00",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: 12,
              }}
            />
            <span
              style={{ color: "#00df00", fontWeight: "bold", fontSize: 18 }}
            >
              Loading...
            </span>
          </div>
          <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
      )}
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>Workout Input</h1>
      <p style={{ fontSize: 16, marginBottom: 8 }}>Enter your workout below:</p>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <textarea
          rows={8}
          cols={40}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            "INCLINE CHEST PRESS\n140X20\n150X12\n150X10\n100X8 superset\n\nTRICEP PULLDOWN"
          }
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #444",
            background: "#222",
            color: "#e7e7e7",
            padding: 12,
            fontSize: 15,
            marginBottom: 12,
            resize: "vertical",
            maxWidth: 420,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button
          onClick={handleParse}
          style={{
            background: "#00df00",
            color: "#222",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Parse Workout
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: "#444",
            color: "#e7e7e7",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Get Weekly Stats
        </button>
        <button
          onClick={handleSendWorkout}
          disabled={loading || parsed.length === 0}
          style={{
            background: "#ff3333",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: loading || parsed.length === 0 ? "not-allowed" : "pointer",
            opacity: loading || parsed.length === 0 ? 0.6 : 1,
          }}
        >
          Send Workout to Backend
        </button>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      {/* Error log box, aesthetic and expandable */}
      {error && (
        <details
          style={{
            background: "#2a1a1a",
            border: "1px solid #ff3333",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 18,
            color: "#ffb3b3",
            boxShadow: "0 2px 8px rgba(255,51,51,0.08)",
            fontFamily: "Fira Mono, monospace",
            fontSize: 15,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <summary
            style={{
              fontWeight: "bold",
              color: "#ff3333",
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            Error Details
          </summary>
          <pre
            style={{
              marginTop: 10,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error}
          </pre>
        </details>
      )}
      <div style={{ marginTop: 20 }}>
        <h2
          style={{
            borderBottom: "1px solid #333",
            paddingBottom: 4,
            marginBottom: 8,
          }}
        >
          Parsed Workout
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {parsed.map((ex, i) => (
            <li
              key={i}
              style={{
                marginBottom: 12,
                background: "#222",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <strong style={{ color: "#00df00", fontSize: 16 }}>
                {ex.name}
              </strong>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                  paddingLeft: 0,
                  listStyle: "none",
                }}
              >
                {ex.sets.map((set: any, j: number) => (
                  <li
                    key={j}
                    style={{
                      background: "#333",
                      borderRadius: 6,
                      padding: "4px 10px",
                      color: "#e7e7e7",
                      fontSize: 14,
                    }}
                  >
                    {set.weight ? `${set.weight}x${set.reps}` : set.note}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 32 }}>
        <h2
          style={{
            borderBottom: "1px solid #333",
            paddingBottom: 4,
            marginBottom: 8,
          }}
        >
          Days Since Last Workout (per muscle group)
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxWidth: 320,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Mock numbers for common muscle groups */}
          {[
            { name: "Chest", days: 3 },
            { name: "Back", days: 5 },
            { name: "Legs", days: 1 },
            { name: "Shoulders", days: 7 },
            { name: "Arms", days: 2 },
            { name: "Core", days: 4 },
          ].map((group) => (
            <li
              key={group.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#333",
                borderRadius: 6,
                padding: "8px 16px",
                marginBottom: 8,
                fontSize: 16,
                fontWeight: "bold",
                color: "#e7e7e7",
              }}
            >
              <span>{group.name}</span>
              <span style={{ color: "#00df00", fontSize: 18 }}>
                {group.days}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
