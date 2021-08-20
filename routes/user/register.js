const express = require('express');
const router = new express.Router();
const fxn = require('../../controllers/user/register');
const mid = require('../../middlewares/jwtverify')

var multer = require('multer');

var fs = require('fs');

const fileFilter = (req,file,cb)=>{
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
var storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    return cb(null, Date.now()+'-' +file.originalname )
  }
});
var upload = multer({ storage: storage,
  limits:{
  fileSize: 1024*1024*10
  },
  fileFilter: fileFilter
});


router.get('/getuser', mid.verifyToken , fxn.getuser);

router.post('/adduser',mid.verifyToken,upload.single('img'),fxn.addUser);

router.post('/login',fxn.login);

router.post("/forgotpass", fxn.forgotpass );

router.post('/changepassword',mid.verifyToken, fxn.changePassword)

router.post("/:userId/:token", fxn.resetpass )

router.delete('/remove',mid.verifyToken, fxn.deleteuser);

router.patch('/update',mid.verifyToken,upload.single('img'),fxn.updateUser);



module.exports = router;