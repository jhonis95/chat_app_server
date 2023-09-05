const express = require('express');
const cors = require('cors')
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
const PORT = 4000;
// const http = require('http'); 
const bodyParser = require('body-parser')

// var jsonParser = bodyParser.json();
const app = express();
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }));
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
    console.log(req.body)
    res.json({
        "msg":`This is CORS-enabled for all origins!`,
        "body":[
            `${user}`,
            `${password}`
        ]
    })
})
