require("dotenv").config(".env");
const express = require("express");
const mongoose = require("mongoose");
// const cors = require('cors');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use("/api", require("./routes/auth"));
app.use("/user", require("./routes/userRoute"));
app.use("/api", require("./routes/category"));
app.use("/api", require("./routes/productsRoute"));
app.use("/api", require("./routes/orderRoute"));
app.use("/deals", require("./routes/dealsRoute"));
app.use("/api", require("./routes/cart"));

const PORT = process.env.PORT || 5000;

const URI = process.env.MONGODB_URL;

mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to Mongodb");
  }
);

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
