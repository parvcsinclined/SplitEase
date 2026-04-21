// ── GroupCard.jsx ────────────────────────────────────────────────────
// Dashboard card showing group name, member count, and balance summary.

export default function GroupCard({ group, onClick }) {
  const memberCount = group.members?.length || 0;

  return (
    <div className="card group-card" onClick={onClick} id={`group-card-${group.id}`}>
      <div className="group-card-header">
        <div className="group-card-icon">👥</div>
        <div className="group-card-info">
          <h3 className="group-card-name">{group.name}</h3>
          <p className="group-card-meta">
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      {group.description && (
        <p className="group-card-desc">{group.description}</p>
      )}
      <div className="group-card-footer">
        <span className="badge badge-primary">View Details →</span>
      </div>
    </div>
  );
}
