import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getTickets = async (params = {}) => {
  const response = await api.get("/tickets", {
    params
  });

  return response.data;
};

export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);

  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await api.post("/tickets", ticketData);

  return response.data;
};

export const updateTicket = async (id, ticketData) => {
  const response = await api.put(
    `/tickets/${id}`,
    ticketData
  );

  return response.data;
};

export const closeTicket = async (id) => {
  const response = await api.put(
    `/tickets/${id}/close`
  );

  return response.data;
};

export const getSupportUsers = async (params = {}) => {
  const response = await api.get("/tickets/users", {
    params
  });

  return response.data;
};

export default api;