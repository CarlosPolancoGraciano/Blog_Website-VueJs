const multer  = require('multer');
const mime = require('mime-types');
const bodyParser = require('body-parser');
let path = require('path');
const express = require('express');
const Pusher = require('pusher');

let appRouter = function (app) {

  /* CONFIG */

  // Pusher config
  const pusher = new Pusher({
    appId: '516350',
    key: 'f9a2f81061f58802038f',
    secret: '7e68c508ac5e62cd6899',
    host: 'api.pusherapp.com',
    encrypted: true
  });

  // bodyParser config
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname)));

  // multer config
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../images')
    },
    filename: (req, file, cb) => {
      console.dir(file.fieldname);
      cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
    }
  });
  
  let upload = multer({storage: storage});

  /* REQUESTS */

  // Save images locally
  app.post('/upload', upload.single('avatar'), function(req, res){
    return res.json({ message: 'Post Arrived',  filename: req.file.filename});
  });
 
  // Send notifications
  app.post('/notification', (req, res) => {
    pusher.trigger('notifications', 'notification_added', {notification: req.body});
    console.log(req.body);
    res.status(200).send();
  });
}

module.exports = appRouter;