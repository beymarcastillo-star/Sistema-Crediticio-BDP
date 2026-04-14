// frontend/src/components/StatCard.jsx
export default function StatCard({ icon, label, value, change, changeType = 'up', accent }) {
  return (
    <div className="stat-card" style={{ '--card-accent': accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-num">{value}</div>
      <div className={`stat-change ${changeType}`}>{change}</div>
    </div>
  );
}
