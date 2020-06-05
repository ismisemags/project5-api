const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// we store the tokens in-memory for simplicity's sake
// in production we'd make them persistent
const authTokens = {};

const generateAuthToken = () => {
  // todo
};

module.exports = {
  setAuthToken: (userId, res) => {
    res.cookie("user_id",userId.id,{signed:true});

    jwt.sign({userId},"secret",(err,token)=>{
      if(err)
      {
        throw err;
      }
      authTokens.token = token;
    });

  },

  unsetAuthToken: (req, res) => {
    // todo
    res.clearCookie("user_id",{signed:true});
    delete authTokens.token;
  },

  getSessionUser: (req, res, next) => {

    next();

  },

  requireAuth: (req, res, next) => {
    jwt.verify(authTokens.token, "secret", (err, authData)=>{
      if(err){
        res.redirect("/login");
      }else{
        next(); 
      }
    });
    
  },

  getHashedPassword: (password) => {
    var hash = crypto.createHash("sha256")
    .update(password)
    .digest("hex");
    return hash;
  },
};
