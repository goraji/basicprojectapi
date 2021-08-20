const express = require('express');
const router = new express.Router();
const fxn = require('../../controllers/admin/register');
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


router.get('/getuserdetail', mid.verifyToken , fxn.getUserDetail);

router.get('/getadmindetail', mid.verifyToken , fxn.getAdminDetail);

router.post('/adduser',mid.verifyToken,upload.single('img'),fxn.addUser);

router.post('/addadmin',upload.single('img'),fxn.addAdmin);

router.post('/adminlogin',fxn.adminLogin);

router.post('/userlogin',fxn.userLogin);

router.post("/forgotpass", fxn.forgotPass);



router.post("/:userId/:token", fxn.resetPass);

router.delete('/remove',mid.verifyToken, fxn.deleteUser);

router.patch('/updateuser',mid.verifyToken,upload.single('img'),fxn.updateUser)


module.exports = router;