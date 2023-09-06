const dbcon=require('./dbConection')

const userAuthDB=(user,password)=>{
    dbcon.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
    const sqlUser=`USE users; SELECT user_email FROM users WHERE user_email = ${user}`
    const sqlPassword=`USE users; SELECT user_password FROM users WHERE user_password = ${password}`
    dbcon.query(sqlUser, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
    });
    dbcon.query(sqlPassword, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
    });
}

module.exports={
    userAuthDB
}