function PriorityBadge({ priority }) {
  const normalizedPriority =
    priority?.toUpperCase();

  return (
    <span
      className={`priority-badge priority-${normalizedPriority?.toLowerCase()}`}
    >
      {normalizedPriority}
    </span>
  );
}

export default PriorityBadge;