import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>

      <div className="hero">

        <div>
          <span className="eyebrow">
            EMPLOYEE SERVICE DESK
          </span>

          <h1>
            How can we help?
          </h1>

          <p>
            Create and track support requests
            across IT, HR, Facilities, Finance,
            and Access Management.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="primary-button"
        >
          Create Ticket
        </Link>

      </div>

      <div className="quick-actions">

        <Link to="/tickets">
          <h3>View Tickets</h3>

          <p>
            Track existing support requests.
          </p>
        </Link>

        <Link to="/tickets/new">
          <h3>New Request</h3>

          <p>
            Submit a new employee request.
          </p>
        </Link>

      </div>

    </div>
  );
}

export default Dashboard;