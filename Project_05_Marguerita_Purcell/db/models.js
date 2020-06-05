const { setAuthToken, getHashedPassword } = require("../routes/auth");
const main = require("../index");

module.exports.User = {
  authUser: (req,res,email, password, success,fail)=>
  {
    var pw = getHashedPassword(password);
    let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    let query = main.db.query(sql, [email, pw], (err, results)=>{
        if(err){
            throw err;
        }
        if(results.length>0){
          var id = results[0].id;
          setAuthToken({id}, res);
          success();
        }
        else{
          fail();
        }
    });
  },
  // function 3: validate a new sign-up
  createUser:(req,res,user,success)=>{
    this.User.emailExists(req.body.email,
      //if email doesn't exist
      ()=>{
      if(req.body.password != req.body.confirm){
        res.render("signup",{message:"Passwords do not match"});
      }
      else{
        console.log(user);
        user.password = getHashedPassword(user.password);
        let sql = 'INSERT into users SET ?';
        let query = main.db.query(sql, user, (err, result)=>{
            if(err){
                throw err;
            }
            console.log(result);
            success();
        });
      }
    },
    //if email existd
    ()=>{
      res.render("signup",{message:"Email already exists"});
    });
  },

  emailExists:(email,success,fail)=>{

    var data = {email:email};
    let sql = 'SELECT * FROM users WHERE ?';
      let query = main.db.query(sql, data, (err, result)=>{
          if(err){
              throw err;
          }
          if(result.length>0){
            fail();
          }else{
            success();
          }
          
      });
  }
};

module.exports.UserRatings = {
  addRating: (userRating,success)=>{
    let sql = 'INSERT into userratings SET ?';
    let query = main.db.query(sql, userRating, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        success();
    });
  },

  userRatingExists: (userid,movieid)=>{
    var data = {ID_user:userid, movie_ID:movieid};
    let sql = 'SELECT * FROM userratings WHERE ?';
      let query = main.db.query(sql, data, (err, result)=>{
          if(err){
              throw err;
          }
          if(result.length>0){
            fail();
          }else{
            success();
          }
          
      });
  },
 

  calculateAverage:(movieid,user,res,next)=>{
    var data = {movie_ID:movieid};
    let sql = 'SELECT * FROM userratings WHERE ?';
      let query = main.db.query(sql, data, (err, result)=>{
          if(err){
              throw err;
          }
          if(result.length>0){
            var userVoted = false;
            var sum = 0;
            for( var i = 0; i < result.length; i++ ){
              sum += parseInt(result[i].starRating); 
              if(result[i].ID_user ==user){
                userVoted = true;
              }
            }

            res.data = {average:sum/result.length, userHasVoted:userVoted};
            next();
          }else{
            res.data = {average:0, userHasVoted:false};
            next();
          }
          
      });
  }
};
