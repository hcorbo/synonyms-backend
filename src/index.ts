import app from "./app";
import path from "path";
import express from "express";
require('dotenv').config();

app.use(express.static(path.join(__dirname, "../public")));

app.listen(process.env.PORT || 5000, () => {
    console.log('The application is listening on port 5000!');
});
