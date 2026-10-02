require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

const app = express();

connectDB();

const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://task-track-sand.vercel.app",
      ];

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server running on port ${process.env.PORT || 5000}`
  );
});