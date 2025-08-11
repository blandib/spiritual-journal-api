require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { MongoClient } = require("mongodb");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database connection
let client;
const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    app.locals.db = db;
    console.log("✅ MongoDB Connected");
    return db;
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

// ===== 4. ROUTES =====
app.use("/users", require("./routes/userRoutes"));
app.use("/entries", require("./routes/entryRoutes"));
app.use("/test", require("./routes/testRoutes"));
app.use("/comments", require("./routes/commentsRoutes"));
app.use("/categories", require("./routes/categoriesRoutes"));
app.use("/auth", require("./routes/authRoutes"));

// ===== 5. SWAGGER =====
require("./swagger")(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", db: !!app.locals.db });
});

app.use(require("./middleware/errorHandler"));

module.exports = { app, connectDB, client };
