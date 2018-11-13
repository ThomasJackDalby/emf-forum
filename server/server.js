var app = require("./app");

const port = 80;

app.listen(port, function() {
    console.log("Server running at http://127.0.0.1:"+port+"/");
});