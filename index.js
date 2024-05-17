
const mongoose = require("mongoose");
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const devLogger = require("morgan");


const app = express();
const http = require('http').Server(app);
app.use(cors());

require("dotenv").config();

const DBuri = process.env.DBuri;
const PORT = process.env.Port || 8080;


app.use(cors());
require("./middleware/passport")(passport);

app.use(express.json());
app.use(devLogger('dev'));

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
        await mongoose.connect(DBuri);
        console.log("Connected to the database successfully");
        http.listen(PORT, () => {
            console.log("Server started on port", PORT);
        });
    } catch (err) {
        console.log(`Unable to connect with the database: ${err.message}`);
        startApp();
    }
};

startApp();



