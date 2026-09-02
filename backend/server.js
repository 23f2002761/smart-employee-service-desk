const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./src/config/db");

const ticketRoutes = require("./src/routes/ticketRoutes");

const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Smart Employee Service Desk API is running"
  });
});

app.use("/api/tickets", ticketRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application");
    process.exit(1);
  }
};

startServer();