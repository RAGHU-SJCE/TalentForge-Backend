const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const savedJobRoutes = require(
  "./routes/savedJobRoutes"
);
const notificationRoutes = require(
  "./routes/notificationRoutes"
);
const companyRoutes = require(
  "./routes/companyRoutes"
);
const adminRoutes = require(
  "./routes/adminRoutes"
);
const interviewRoutes = require(
  "./routes/interviewRoutes"
);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
  res.send("TalentForge Backend Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api/saved-jobs",
  savedJobRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use(
  "/api/company",
  companyRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/interviews",
  interviewRoutes
);

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
};

startServer();