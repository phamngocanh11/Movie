const express = require("express");
const { connectToDB } = require("./config/connectToDB");
const cors = require("cors");
const logger = require("./config/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

// Ensure logs directory exists
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const app = express();
const port = process.env.PORT || 3001;

connectToDB();

app.use(cors({ credentials: true }));
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const userRoutes = require("./routes/userRoutes");
const actorRoutes = require("./routes/actorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const directorRoutes = require("./routes/directorRoutes");
const movieRoutes = require("./routes/movieRoutes");
const movieWatchedRoutes = require("./routes/movieWatchedRoutes");
const manufacturerRoutes = require("./routes/manufacturerRoutes");

app.use("/api/users", userRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/directors", directorRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/movie-watched", movieWatchedRoutes);
app.use("/api/manufacturers", manufacturerRoutes);

app.listen(port, () => {
  logger.info(`Server dang chay o port ${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
});
