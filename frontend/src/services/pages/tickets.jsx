import {
  useEffect,
  useState
} from "react";

import { getTickets } from "../services/api";

import TicketResults from "../components/TicketResults";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    categoryId: "",
    search: ""
  });

  const loadTickets = async () => {
    try {
      setLoading(true);

      const response = await getTickets(filters);

      setTickets(response.data || []);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    loadTickets();
  };

  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Tickets</h1>

          <p>
            View and manage employee support requests.
          </p>
        </div>
      </div>

      <form
        className="filters"
        onSubmit={handleSearch}
      >

        <input
          type="text"
          name="search"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">
            All Statuses
          </option>

          <option value="OPEN">
            Open
          </option>

          <option value="ASSIGNED">
            Assigned
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

          <option value="CLOSED">
            Closed
          </option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="">
            All Priorities
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="LOW">
            Low
          </option>
        </select>

        <button type="submit">
          Apply Filters
        </button>

      </form>

      <TicketResults
        tickets={tickets}
        loading={loading}
      />

    </div>
  );
}

export default Tickets;