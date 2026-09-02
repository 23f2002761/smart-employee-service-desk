const express = require("express");

const router = express.Router();

const ticketController = require("../controllers/ticketController");

const validateRequest = require("../middleware/validation");

const {
  createTicketValidation,
  ticketIdValidation,
  updateTicketValidation
} = require("../middleware/ticketValidation");

router.post(
  "/",
  createTicketValidation,
  validateRequest,
  ticketController.createTicket
);

router.get(
  "/",
  ticketController.getTickets
);

router.get(
  "/users",
  ticketController.getUsers
);

router.get(
  "/:id",
  ticketIdValidation,
  validateRequest,
  ticketController.getTicketById
);

router.put(
  "/:id",
  updateTicketValidation,
  validateRequest,
  ticketController.updateTicket
);

router.put(
  "/:id/close",
  ticketIdValidation,
  validateRequest,
  ticketController.closeTicket
);

module.exports = router;