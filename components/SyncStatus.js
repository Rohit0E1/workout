"use client";

export default function SyncStatus({ status }) {
  const map = {
    idle:    { dot: "#CCC",    text: "Offline",   bg: "#F5F5F5" },
    syncing: { dot: "#FBBF24", text: "Syncing…",  bg: "#FFFBEB" },
    synced:  { dot: "#10B981", text: "Synced",    bg: "#ECFDF5" },
    error:   { dot: "#EF4444", text: "Sync Error", bg: "#FEF2F2" },
  };
  const s = map[status] || map.idle;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, borderRadius: 20, padding: "3px 10px 3px 7px",
      fontSize: 9, fontWeight: 800, color: s.dot, letterSpacing: 0.5,
      border: `1px solid ${s.dot}33`,
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%", background: s.dot,
        boxShadow: status === "syncing" ? `0 0 6px ${s.dot}` : "none",
        animation: status === "syncing" ? "pulse 1.5s infinite" : "none",
      }} />
      {s.text}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
