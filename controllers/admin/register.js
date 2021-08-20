const User = require('../../schema/user/user');
const Admin = require('../../schema/admin/admin');
const crypto = require("crypto");
const Token = require('../../schema/admin/token');
const Joi = require("joi");
const sendEmail = require('../../utils/sendemail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const deleteUser = async(req,res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    let user = await User.findByIdAndDelete({_id:id},);
    res.json({
      msg: user.name+ " is removed",
      data:user
    })
  } catch (error) {
    res.json({
      msg:"user not removed"
    })
  }
}

const forgotPass = async(req,res) =>{
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const {email} = req.body;
    const user =  await Admin.findOne({email});
    if (!user)
        return res.status(400).send("admin with given email doesn't exist");
    
    let token = await Token.findOne({_id: user._id});
    if (!token) {
        token = await new Token({
            _id: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail('gorasunil61@gmail.com', "Password reset", link);

    res.send("password reset link sent to your email account");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
}
const resetPass = async (req,res)=>{
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const token = await Token.findOne({
        _id: req.params.userId,
        token: req.params.token,
    });
    if(!token){
      res.send("invalid url");
    }
    const pass = req.body.password;
    let hash = await bcrypt.hash(pass, 10);
    const _id = req.params.userId;
    await Admin.findOneAndUpdate({_id},{password:hash});
    await token.delete();
    res.send("password reset sucessfully.");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
}

const getUserDetail = async(req,res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    let user = await User.findById({_id:id},);
    const dob1 = new Date(user.date);
    const dob2 = new Date();
    const y1 = dob1.getYear();
    const y2 = dob2.getYear();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const m1 = dob1.toLocaleDateString(undefined, options);
    const d1 = dob1.getDate();
    const y3 = y2-y1;
    // console.log(user.date);
    // 1994-11-05T13:15:30.000+00:00
    res.json({
      m1,
      msg: user.name+ "'s profile",
      // data:user
    })
  } catch (error) {
    res.json({
      msg:"invalid details"
    })
  }
  res.send('profile page');
}
const getAdminDetail = async(req,res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    let user = await Admin.findById({_id:id},);
    res.json({
      msg: user.name+ "'s profile",
      data:user
    })
  } catch (error) {
    res.json({
      msg:"invalid details"
    })
  }
  res.send('profile page');
}

const addUser = async(req,res) =>{
  try {
    const data = new User(req.body);
    const date = new Date(req.body.date);

    console.log(date);
        let hash = await bcrypt.hash(data.password, 10);
        
        data.password = hash;
        data.img = req.file.filename;
        const user = await data.save();
      res.send(user);
  } catch (error) {
      console.log(error);
      res.send('email alredy exists');
  }
}

const addAdmin = async(req,res) =>{
  try {
    const data = new Admin(req.body);
        let hash = await bcrypt.hash(data.password, 10);
        data.password = hash;
        data.img = req.file.filename;
        const user = await data.save();
      res.send(user);
  } catch (error) {
      console.log(error);
      res.send('email alredy exists');
  }
}

const adminLogin = async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      res.send('plzz fill all fields');
    }else{
      const user = await Admin.findOne({email});
      if(!user){
        res.send('invalid email')
      }else{
        let match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = jwt.sign(
            { id: user._id,},
            process.env.skey,
            {
              expiresIn: "2h",
            }
          )
          res.status(200).json({
            token:token
          })
        } else {
          res.send('invalid password')
        }
      }
    }
  }catch (error) {
      console.log(error);
      res.send(error);
  }
}
const updateUser = async(req,res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    const data = await User.findById({_id:id}) ;
    const address1 = data.address;
    const aid =  address1[0]._id;
    const name = req.body.name;
    const email = req.body.email;
    // const password = req.body.password;
    const img = req.file.filename;
    const address = req.body.address;
    const houseno = address.houseno;
    const astreet = address.street;
    const alandmark = address.landmark;
    const azip = address.zip;
    // let hash = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate({_id:id},{
      email:email,
      name:name,
      // password:hash,
      img:img,
      $set: { "address.$[id].houseno" : houseno ,
      "address.$[id].street" : astreet ,
      "address.$[id].landmark" : alandmark,
      "address.$[id].zip" : azip
    },
     }
  ,{
    new:true,
    arrayFilters: [{
      "id": aid,
    }]
  });
    // console.log(houseno);
    res.send(user);
// console.log(user);
  }catch(error){
    res.send(error.message);
    console.log(error.message)
  }
}
const userLogin = async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      res.send('plzz fill all fields');
    }else{
      const user = await User.findOne({email});
      if(!user){
        res.send('invalid email')
      }else{
        let match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = jwt.sign(
            { id: user._id,},
            process.env.skey,
            {
              expiresIn: "2h",
            }
          )
          res.status(200).json({
            token:token
          })
        } else {
          res.send('invalid password')
        }
      }
    }
  }catch (error) {
      console.log(error);
      res.send(error);
  }
}

module.exports = {getAdminDetail,getUserDetail,addUser,deleteUser,adminLogin,userLogin,addAdmin,updateUser,forgotPass,resetPass}