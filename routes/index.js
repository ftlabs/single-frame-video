const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: process.env.TMP_FOLDER || '/tmp/' })

const makeVideo = require('../bin/lib/make-video');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FT Labs Single Frame Video Service' });
});

router.post('/create', upload.array('file', 2), function(req, res){

  console.log(req.files);

  makeVideo.create(req.files[1], req.files[0])
    .then(jobID => {
      res.send(jobID);
    })
  ;

});

router.get('/check/:jobID', function(req, res, next) {

  res.end(makeVideo.check(req.params.jobID));

});

router.get('/download/:jobID', function(req, res){
  
  const completedJob = makeVideo.get(req.params.jobID);

  if(!completedJob){
    res.status(404);
    res.end();
  } else {
    res.download(completedJob.destination, `${completedJob.id}.mp4`);
  }


});

module.exports = router;
