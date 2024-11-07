const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// CORS setup
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Get the allowed origins from environment variables
      const allowedOrigins = [
        process.env.CLIENT_URL, // Production URL from .env file
        "http://localhost:3000", // Localhost URL for development
      ];

      // If the origin is in the allowed list, allow it, otherwise block it
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start the server
connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    )
  )
  .catch((error) => {
    console.log(error);
  });
