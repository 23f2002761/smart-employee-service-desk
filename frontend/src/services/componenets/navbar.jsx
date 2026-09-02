import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">

        <Link
          to="/"
          className="logo"
        >
          Smart Service Desk
        </Link>

        <div className="nav-links">
          <Link to="/">
            Dashboard
          </Link>

          <Link to="/tickets">
            Tickets
          </Link>

          <Link to="/tickets/new">
            Create Ticket
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;