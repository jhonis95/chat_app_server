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
  key: "userId",
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge:300000, httpOnly:false }
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
app.use(function(req, res, next) {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }
  next();
});
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
        res.send({
          result:result,
          authSucess:true,
          sessionID:req.sessionID
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
app.post('/',(req,res)=>{
  console.log(req.sessionStore)
  const session=req.sessionStore.sessions
  for(const sessionID in session){
    if(sessionID==req.body.sessionID){
      const data =req.sessionStore.sessions[sessionID]
      res.send({
        "userData":data,
        "msg":"sending user data",
      })
    }
  }
  // session.map((sessionID)=>{
  //   if(sessionID==req.body.sessionID){
  //     console.log('get in data')
  //     res.send({
  //       "userName":sessionID.user,
  //       "msg":"sending user data",
  //     })
  //   }
  // })
})
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
