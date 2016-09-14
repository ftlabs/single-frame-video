const debug = require('debug')('routes:index');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: process.env.TMP_FOLDER || '/tmp/' });

const makeVideo = require('../bin/lib/make-video');
const checkFile = require('../bin/lib/check-file');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'FT Labs Single Frame Video Service' });
});

router.post('/create', upload.array('file', 2), function(req, res){

  debug(req.files);
  debug(req.body);

  const fileChecks = req.files.map(f => {
    return checkFile(f);
  });

  if(req.files.length < 2){
    res.status(400);
    res.send("Not enough files were uploaded");
  } else {

    Promise.all(fileChecks)
      .then(function(){
        
        makeVideo.create(req.files[1], req.files[0], req.body.metadata)
          .then(jobID => {
            res.send(jobID);
          })
        ;

      })
      .catch(err => {
        debug(err);
        res.status(400);
        res.send("One or more of the files sent did not meet the requirements");
      })
    ;

  }


});

router.get('/check/:jobID', function(req, res) {

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
