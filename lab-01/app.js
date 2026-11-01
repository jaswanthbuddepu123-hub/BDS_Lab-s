const express = require("express");
const { format } = require("date-fns");

const app = express();

// API - 1
app.get("/", (request, response) => {
  response.send("Welcome to my Express Server!");
});

// API - 2
app.get("/about", (request, response) => {
  const resultAbout = {
    studentName: "BUDDEPU VENKATA JASWANTH",
    registrationNumber: "252U1R1045",
    section: "CSE-2A",
    roomNumber: "223",
  };
  response.send(resultAbout);
});

// API - 3S
app.get("/time", (request, response) => {
  const date = new Date();

  const formattedDate = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  response.send(`Current Date and Time: ${formattedDate}`);
});

// Handle Unknown Routes
app.use((request, response) => {
  response.status(404).send("Page Not Found");
});

app.listen(3000, () => {
  console.log("Express server is running on port number 3000");
});
