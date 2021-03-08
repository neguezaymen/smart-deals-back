const express = require("express");
const ConnectDB = require("./helpers/ConnectDB");
const cors = require("cors");
const app = express();

// connect To DB
ConnectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
// define routes
app.use("/signin", require("./routes/signin"));
app.use("/login", require("./routes/login"));
// app.use("/post", require("./routes/post"));
app.use("/profile", require("./routes/Profile"));
app.use("/post", require("./routes/post"));
app.use("/discussions", require("./routes/discussion"));
app.use("/bon-plans", require("./routes/deal"));
app.use("/comment/deal", require("./routes/dealComments"));
app.use("/comment/discussion", require("./routes/discussionComments"));
app.use("/user", require("./routes/userInfo"));
app.use("/footerinfo", require("./routes/footerInfo"));
app.use("/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on PORT:${PORT}`));
