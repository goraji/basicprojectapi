const express = require('express');
const router = new express.Router();
const Country = require('../../schema/country/country');


router.post('/addcountry',async(req,res)=>{
  try {
    const data = new Country(req.body);
    await data.save();
    res.send(data);
  } catch (error) {
    res.send(error.message)
  }
});

router.get('/all',async(req,res)=>{
  try {
    const data = await Country.find();
    
    res.send(data);
  } catch (error) {
    res.send(error.message)
  }
});
router.get('/countries',async(req,res)=>{
  try {
    const data = await Country.find({$and:[{"country.cname":"c1"},{"country.state.sname":"s1"}]},{"country.state.city":1});
    // const data = await Country.find({"country.cname":"c1"},{"country.state.city.dname":1 , _id:0});
    // const data = await Country.aggregate([
    //   {$group:{_id: {country: "$country.cname", state: "$country.state.sname", city: "$country.state.city.dname"}}}
    // ]);
    // const data = await Country.aggregate({$match: {"country.cname":"c1"}});
    res.send(data);
  } catch (error) {
    res.send(error.message)
  }
});
router.patch('/updatecountry',async(req,res)=>{
  try {
    const old = req.body.old;
    const nyu = req.body.nyu;
    const user = await Country.findOneAndUpdate({"country.cname": old},{
      "country.cname":nyu},{new:true});
      res.send(user)
  } catch (error) {
    res.send(error.message)
  }
})

router.patch('/updatestate',async(req,res)=>{
  try {
    const country = req.body.country;
    const old = req.body.old;
    const nyu = req.body.nyu;
    const user = await Country.findOneAndUpdate({$and:[{"country.cname": country},{"country.state.sname": old}]},{
      "country.state.sname":nyu},{new:true});
      res.send(user)
  } catch (error) {
    res.send(error.message)
  }
})

router.get('/updatecity',async(req,res)=>{
  try {
    const country = req.body.country;
    const state = req.body.state;
    const old = req.body.old;
    const nyu = req.body.nyu;
    const user = await Country.find({$and:[{"country.cname": country},{"country.state.sname": state},{"country.state.city.dname.$":old}]}
    // const user = await Country.updateOne({$and:[{"country.cname": country},{"country.state.sname": state},{"country.state.city.dname":old}]},
    // {$set:{"country.state.city.dname.$":nyu}},{new:true}
  );
      res.send(user)
  } catch (error) {
    console.log(error);
    res.send(error.message)
  }
})




module.exports = router;