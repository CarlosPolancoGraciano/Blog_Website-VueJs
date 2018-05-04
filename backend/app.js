let express = require('express');
let routes = require("./routes/routes.js");
let fs = require('fs');
let cors = require('cors');
let app = express();
app.use(cors());
app.use(express.static('../images'));

routes(app);

var server = app.listen(15536, function () {
  console.log("app running on port.", server.address().port);
});