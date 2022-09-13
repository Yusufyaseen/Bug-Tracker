const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { unknownEndPointHandler } = require("./middlewares/unknownEndPoint.js");
const { userRoutes } = require("./routes/users.js");
const { authRoutes } = require("./routes/auth.js");
const { projectRoutes } = require("./routes/projects.js");
const { memberRoutes } = require("./routes/members.js");
const { bugRouter } = require("./routes/bugs.js");
const { noteRouter } = require("./routes/notes.js");
dotenv.config();
const port = process.env.PORT || 3500;
const app = express();
const server = http.createServer(app);
// app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("مصر بخير");
});
app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/projects", memberRoutes);
app.use("/projects", bugRouter);
app.use("/projects", noteRouter);
app.use(unknownEndPointHandler);

server.listen(port, () => {
  console.log(`Server is running in: ${port}`);
});
