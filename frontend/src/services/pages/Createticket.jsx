import TicketForm from "../components/TicketForm";

function CreateTicket() {
  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Create Ticket</h1>

          <p>
            Submit a request to the appropriate
            department.
          </p>
        </div>
      </div>

      <TicketForm />

    </div>
  );
}

export default CreateTicket;