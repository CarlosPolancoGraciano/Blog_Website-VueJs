let express = require('express');
let routes = require("./routes/routes.js");

let path = require('path');
let fs = require('fs');
let cors = require('cors');
let app = express();
app.use(cors());

routes(app);


var server = app.listen(15536, function () {
  console.log("app running on port.", server.address().port);
});