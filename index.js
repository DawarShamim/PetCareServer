
const mongoose = require("mongoose");
const passport = require("passport");
const express = require("express");
const app = express();
const cors = require("cors");

const logger = require("morgan");
app.use(logger("dev"));
require("dotenv").config();

const DBurl = process.env.DBurl;
const PORT = process.env.Port || 8080;


app.use(cors()); // Add cors middleware
require("./middleware/passport")(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", require("./routes/userRoute"));



app.use((error, req, res, next) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    console.error("for unknown error", error);
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

app.all("*", (req, res) => {
    res.status(404).json({ error: "404 Not Found" });
});


startApp = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(DBurl);
        console.log("Connected to the database successfully");
        server.listen(PORT, () => {
            console.log("Server started on port", PORT);
        });
    } catch (err) {
        console.log(`Unable to connect with the database: ${err.message}`);
        startApp();
    }
};

startApp();



