const { body, param } = require("express-validator");

const createTicketValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must contain at least 10 characters"),

  body("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a valid number"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),

  body("createdBy")
    .notEmpty()
    .withMessage("CreatedBy is required")
    .isInt({ min: 1 })
    .withMessage("CreatedBy must be a valid user ID")
];

const ticketIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Ticket ID must be a valid number")
];

const updateTicketValidation = [
  ...ticketIdValidation,

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),

  body("status")
    .optional()
    .isIn([
      "OPEN",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED"
    ])
    .withMessage("Invalid status"),

  body("assignedTo")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("AssignedTo must be a valid user ID")
];

module.exports = {
  createTicketValidation,
  ticketIdValidation,
  updateTicketValidation
};