const express = require("express");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.listen(3000, () => {
    console.log("App listening on port 3000");
});

app.get("/", (require, result) => {
    result.sendFile(path.resolve(__dirname, "pages/index.html"));
});

app.get("/about", (require, result) => {
    result.sendFile(path.resolve(__dirname, "pages/about.html"));
});
