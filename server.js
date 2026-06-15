const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
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
const connectionRoutes = require("./routes/connectionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileViewRoutes = require("./routes/profileViewRoutes");
const endorsementRoutes = require("./routes/endorsementRoutes");
const projectStarRoutes = require("./routes/projectStarRoutes");
const suggestionsRoutes = require("./routes/suggestionsRoutes");

const app = express();
const server = http.createServer(app);

const socket = require("./socket");
socket.init(server);

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile-views", profileViewRoutes);
app.use("/api/endorsements", endorsementRoutes);
app.use("/api/project-stars", projectStarRoutes);
app.use("/api/suggestions", suggestionsRoutes);

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
};

startServer();