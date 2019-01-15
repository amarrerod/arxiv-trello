"use strict";

const express = require("express");
const cors = require("cors");

let app = express();
app.use(cors({
    origin: "https://trello.com"
}));
app.use(express.static("public"));
app.get("*", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

let listener = app.listen(process.env.PORT, () => {
    console.log("Listening @ port" + listener.address().port);
});