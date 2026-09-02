import { Link } from "react-router-dom";

import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

function TicketResults({ tickets, loading }) {
  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (!tickets.length) {
    return (
      <div className="empty-state">
        <h3>No tickets found</h3>

        <p>
          Try changing your filters or create
          a new ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <Link
          to={`/tickets/${ticket.TicketId}`}
          className="ticket-card"
          key={ticket.TicketId}
        >
          <div className="ticket-card-header">

            <span className="ticket-id">
              #{ticket.TicketId}
            </span>

            <PriorityBadge
              priority={ticket.Priority}
            />

          </div>

          <h3>{ticket.Title}</h3>

          <p className="ticket-description">
            {ticket.Description}
          </p>

          <div className="ticket-meta">

            <span>
              {ticket.CategoryName}
            </span>

            <StatusBadge
              status={ticket.Status}
            />

          </div>

          <div className="ticket-footer">

            <span>
              Created by: {ticket.CreatorName}
            </span>

            <span>
              Assigned to:{" "}
              {ticket.AssigneeName || "Unassigned"}
            </span>

          </div>
        </Link>
      ))}
    </div>
  );
}

export default TicketResults;