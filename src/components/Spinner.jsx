// ── Spinner.jsx ──────────────────────────────────────────────────────
// Reusable loading spinner used as Suspense fallback and loading state.

export default function Spinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <span className="spinner-text">Loading...</span>
      </div>
    </div>
  );
}
