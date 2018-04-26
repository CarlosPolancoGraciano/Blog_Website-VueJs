let multer  = require('multer');
let mime = require('mime-types');

let appRouter = function (app) {

  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../public/images')
    },
    filename: (req, file, cb) => {
      console.dir(file.fieldname);
      cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
    }
  });
  
  let upload = multer({storage: storage});

  app.post('/upload', upload.single('avatar'), function(req, res){
    return res.json({ message: 'Post Arrived',  url: req.file.filename});
  });
}

module.exports = appRouter;