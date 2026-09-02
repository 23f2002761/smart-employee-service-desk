function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase();

  return (
    <span
      className={`status-badge status-${normalizedStatus?.toLowerCase()}`}
    >
      {normalizedStatus?.replace("_", " ")}
    </span>
  );
}

export default StatusBadge;