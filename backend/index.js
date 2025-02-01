const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDB } = require("./connection");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log("Server listening to PORT:", PORT);
})