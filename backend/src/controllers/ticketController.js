const ticketService = require("../services/ticketService");

const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body);

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getTickets(req.query);

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(
      Number(req.params.id)
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(
      Number(req.params.id),
      req.body
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

const closeTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.closeTicket(
      Number(req.params.id)
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or already closed"
      });
    }

    res.json({
      success: true,
      message: "Ticket closed successfully",
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await ticketService.getUsers(req.query);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  getUsers
};