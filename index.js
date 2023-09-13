const express = require('express');
const cors = require('cors')
const dbcon=require('./dbConection')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const PORT = 4000;
// const http = require('http'); 
const bodyParser = require('body-parser');
const query = require('express/lib/middleware/query');

// var jsonParser = bodyParser.json();
const app = express();
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge:300000 }
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']}))
app.use(function(req, res, next) {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }
  next();
});
let allowCrossDomain = function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  next();
}
app.use(allowCrossDomain);

app.listen(PORT,()=>{
    console.log("server activated")
})
app.post("/login",(req,res)=>{
    const { user, password } = req.body;
    dbcon.connect(function(err) {
      if (err) throw err;
      console.log("Connected with DB!");
    });
    const query=`SELECT username FROM users WHERE username = ? and password= ?`;
    dbcon.query(query,[user,password],(err,result)=>{
      if(err){
        res.json({"error":`${err}`})
      }
      if(result.length>0){
        req.session.user=user;
        req.session.save();
        console.log(req.session)
        res.send({
          result:result,
          authSucess:true
        })
      }else{
        res.json(
          {
            "msg":"no user found",
            "error":`${err}`,
            "authSucess":false
          }
        )
      }
    })
})
app.post("/singup",(req,res)=>{
  const {userToResister,passwordToResister}=req.body
  dbcon.connect(function(err) {
    if (err) throw err;
    console.log("Connected with DB!");
  });
  const query="INSERT INTO users (username,password) VALUES( ?,?)"
  dbcon.query(query,[userToResister,passwordToResister],(err,result)=>{
    if(err){
      res.json({
        "error":`${err}`,
        "authSucess":false,
        "msg":"password already exist"
      })
    }
    res.send({
      "msg":"user created with sucess",
      "authSucess":true,
      "result":result
    })
    // if(result.length>0){
    //   res.send(result)
    // }else{
    //   res.json({"msg":"user already exists"})
    // }
  })
})
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
