const express = require("express");
const natural = require("natural");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const classifier = new natural.BayesClassifier();

classifier.addDocument("no prende","hardware");
classifier.addDocument("internet falla","red");
classifier.train();

app.post("/analyze",(req,res)=>{
 const result = classifier.classify(req.body.text);
 res.json({category:result});
});

app.listen(3005);