const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let devices = [];

app.get("/devices",(req,res)=>{
 res.json(devices);
});

app.post("/devices",(req,res)=>{
 devices.push(req.body);
 res.send("ok");
});

app.listen(3006);