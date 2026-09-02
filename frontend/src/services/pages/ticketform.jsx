import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTicket } from "../services/api";

function TicketForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "MEDIUM"
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

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

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (
      formData.title.trim().length < 5
    ) {
      newErrors.title =
        "Title must contain at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required";
    } else if (
      formData.description.trim().length < 10
    ) {
      newErrors.description =
        "Description must contain at least 10 characters";
    }

    if (!formData.categoryId) {
      newErrors.categoryId =
        "Please select a department";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    const validationErrors = validate();

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await createTicket({
        ...formData,

        categoryId: Number(
          formData.categoryId
        ),

        createdBy: 1
      });

      navigate(
        `/tickets/${response.data.TicketId}`
      );

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        "Failed to create ticket"
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="ticket-form"
      onSubmit={handleSubmit}
    >

      {serverError && (
        <div className="error-message">
          {serverError}
        </div>
      )}

      <div className="form-group">

        <label>
          Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Unable to access VPN"
        />

        {errors.title && (
          <span className="field-error">
            {errors.title}
          </span>
        )}

      </div>

      <div className="form-group">

        <label>
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your issue..."
          rows="6"
        />

        {errors.description && (
          <span className="field-error">
            {errors.description}
          </span>
        )}

      </div>

      <div className="form-group">

        <label>
          Department
        </label>

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
        >
          <option value="">
            Select department
          </option>

          <option value="1">
            IT
          </option>

          <option value="2">
            HR
          </option>

          <option value="3">
            Facilities
          </option>

          <option value="4">
            Finance
          </option>

          <option value="5">
            Access Management
          </option>
        </select>

        {errors.categoryId && (
          <span className="field-error">
            {errors.categoryId}
          </span>
        )}

      </div>

      <div className="form-group">

        <label>
          Priority
        </label>

        <select
          name="priority"
          value={formData.priority}
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

      <button
        type="submit"
        disabled={submitting}
        className="primary-button"
      >
        {submitting
          ? "Creating..."
          : "Create Ticket"}
      </button>

    </form>
  );
}

export default TicketForm;