const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Connect mongodb
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connect Successfully");
    })
    .catch((err) => {
        console.log(err.message);
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server stated on Port ${process.env.PORT}`);
});
