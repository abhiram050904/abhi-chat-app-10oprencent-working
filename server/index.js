const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public", "build", "index.html"));
  });
}

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on ${process.env.PORT || 5000}`)
);

const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
