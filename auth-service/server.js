const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [
 { email:"admin@test.com", password:bcrypt.hashSync("123456",10), role:"admin"},
 { email:"tec@test.com", password:bcrypt.hashSync("123456",10), role:"tecnico"},
 { email:"bi@test.com", password:bcrypt.hashSync("123456",10), role:"bi"},
 { email:"ger@test.com", password:bcrypt.hashSync("123456",10), role:"gerencia"}
];

app.post("/login", async (req,res)=>{
 const {email,password} = req.body;
 const user = users.find(u=>u.email===email);
 if(!user) return res.status(401).send("Error");

 const ok = await bcrypt.compare(password,user.password);
 if(!ok) return res.status(401).send("Error");

 const token = jwt.sign(user,"secret");
 res.json({token,user});
});

app.listen(3002);