const User = require('../../schema/user/user');
const crypto = require("crypto");
const Token = require('../../schema/admin/token');
const Joi = require("joi");
const sendEmail = require('../../utils/sendemail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const deleteuser = async(req,res)=>{
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

const forgotpass = async(req,res) =>{
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const {email} = req.body;
    const user =  await User.findOne({email});
    if (!user)
        return res.status(400).send("user with given email doesn't exist");
    
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
const resetpass = async (req,res)=>{
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
    await User.findOneAndUpdate({_id},{password:hash});
    await token.delete();
    res.send("password reset sucessfully.");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
}

const getuser = async(req,res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    let user = await User.findById({_id:id},);
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


const login = async(req,res)=>{
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

const changePassword = async(req,res) =>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    const data = await User.findById({_id:id}) ;
    const dataPass = data.password;
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;
    let result = await bcrypt.compare(oldPass, dataPass);
if(result){
  let hash = await bcrypt.hash(newPass, 10);
  data.password = hash;
  await data.save();
res.send('password change success!');
}else{
  res.send('password not matched')
}
       
  } catch (error) {
      console.log(error);
      res.send(error.message);
  }
}
const addUser = async(req,res) =>{
  try {
    const data = new User(req.body);
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


module.exports = {getuser,addUser,login,forgotpass,resetpass,deleteuser,updateUser,changePassword}