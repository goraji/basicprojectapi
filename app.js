require ('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT;
require('./db/conn');
app.use(express.json());
const uploads = path.join(__dirname,"./uploads")
// console.log(uploads);
app.use(express.static(uploads));

const admin = require('./routes/admin/register');
const user = require('./routes/user/register');
const country = require('./routes/croute/croute');

app.use("/admin",admin);
app.use("/user",user);
app.use("/country",country);



app.listen(port, () => {
    console.log(`runnning at ${port}`);
})