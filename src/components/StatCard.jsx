function StatCard({ title, value, className = "" }) {
  return (
    <div className={`stat-card ${className}`}>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;