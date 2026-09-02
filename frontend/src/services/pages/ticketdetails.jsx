import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getTicketById,
  updateTicket,
  closeTicket,
  getSupportUsers
} from "../services/api";

import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [supportUsers, setSupportUsers] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] =
    useState(false);

  const [formData, setFormData] = useState({
    status: "",
    priority: "",
    assignedTo: "",
    resolutionNotes: ""
  });

  const loadTicket = async () => {
    try {
      const response =
        await getTicketById(id);

      const ticketData = response.data;

      setTicket(ticketData);

      setFormData({
        status: ticketData.Status,
        priority: ticketData.Priority,
        assignedTo:
          ticketData.AssigneeId || "",
        resolutionNotes: ""
      });

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const loadSupportUsers = async () => {
    try {
      const response =
        await getSupportUsers({
          role: "SUPPORT"
        });

      setSupportUsers(
        response.data || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTicket();
    loadSupportUsers();
  }, [id]);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);

      await updateTicket(id, {
        status: formData.status,
        priority: formData.priority,

        assignedTo:
          formData.assignedTo
            ? Number(formData.assignedTo)
            : null,

        resolutionNotes:
          formData.resolutionNotes,

        userId: 3
      });

      await loadTicket();

      setFormData((current) => ({
        ...current,
        resolutionNotes: ""
      }));

    } catch (error) {
      console.error(error);

    } finally {
      setUpdating(false);
    }
  };

  const handleClose = async () => {
    if (
      !window.confirm(
        "Are you sure you want to close this ticket?"
      )
    ) {
      return;
    }

    try {
      await closeTicket(id);

      await loadTicket();

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  if (!ticket) {
    return (
      <div>
        <h2>Ticket not found</h2>

        <button
          onClick={() =>
            navigate("/tickets")
          }
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-details">

      <button
        className="back-button"
        onClick={() =>
          navigate("/tickets")
        }
      >
        ← Back to Tickets
      </button>

      <div className="detail-header">

        <div>
          <span className="ticket-id">
            Ticket #{ticket.TicketId}
          </span>

          <h1>{ticket.Title}</h1>
        </div>

        <PriorityBadge
          priority={ticket.Priority}
        />

      </div>

      <div className="detail-grid">

        <section className="detail-card">

          <h2>Ticket Information</h2>

          <div className="info-row">
            <span>Department</span>

            <strong>
              {ticket.CategoryName}
            </strong>
          </div>

          <div className="info-row">
            <span>Status</span>

            <StatusBadge
              status={ticket.Status}
            />
          </div>

          <div className="info-row">
            <span>Created By</span>

            <strong>
              {ticket.CreatorName}
            </strong>
          </div>

          <div className="info-row">
            <span>Assigned To</span>

            <strong>
              {ticket.AssigneeName ||
                "Unassigned"}
            </strong>
          </div>

          <div className="info-row">
            <span>Created</span>

            <strong>
              {new Date(
                ticket.CreatedDate
              ).toLocaleString()}
            </strong>
          </div>

        </section>

        <section className="detail-card">

          <h2>Description</h2>

          <p className="description">
            {ticket.Description}
          </p>

        </section>

      </div>

      <section className="detail-card">

        <h2>Activity</h2>

        {!ticket.comments?.length ? (
          <p>
            No activity yet.
          </p>
        ) : (
          <div className="activity-list">

            {ticket.comments.map(
              (comment) => (
                <div
                  className="activity-item"
                  key={comment.CommentId}
                >
                  <div>
                    <strong>
                      {comment.UserName}
                    </strong>

                    <span>
                      {" "}
                      ·{" "}
                      {new Date(
                        comment.CreatedDate
                      ).toLocaleString()}
                    </span>
                  </div>

                  <p>
                    {comment.Notes}
                  </p>
                </div>
              )
            )}

          </div>
        )}

      </section>

      {ticket.Status !== "CLOSED" && (
        <section className="detail-card">

          <h2>Update Ticket</h2>

          <form
            onSubmit={handleUpdate}
            className="update-form"
          >

            <div className="form-group">

              <label>
                Assign To
              </label>

              <select
                name="assignedTo"
                value={
                  formData.assignedTo
                }
                onChange={handleChange}
              >
                <option value="">
                  Unassigned
                </option>

                {supportUsers.map(
                  (user) => (
                    <option
                      key={user.UserId}
                      value={user.UserId}
                    >
                      {user.Name} —{" "}
                      {user.DepartmentName}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
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
              </select>

            </div>

            <div className="form-group">

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={
                  formData.priority
                }
                onChange={handleChange}
              >
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

            </div>

            <div className="form-group">

              <label>
                Resolution / Update Notes
              </label>

              <textarea
                name="resolutionNotes"
                value={
                  formData.resolutionNotes
                }
                onChange={handleChange}
                rows="5"
                placeholder="Add an update or resolution note..."
              />

            </div>

            <div className="action-buttons">

              <button
                type="submit"
                className="primary-button"
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Update Ticket"}
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={handleClose}
              >
                Close Ticket
              </button>

            </div>

          </form>

        </section>
      )}

    </div>
  );
}

export default TicketDetails;