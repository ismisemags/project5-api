const { requireAuth, setAuthToken, unsetAuthToken } = require("./auth");
const { User, UserRatings } = require("../db/models");

const MytsApi = require('myts-api').API;
const myts = new MytsApi();

module.exports = (app) => {
  app.get("/",(req,res)=>{      // requireAuth, (req, res) => { 
    var user = req.signedCookies["user_id"];    
      myts.listMovies({sort_by:"year",order_by:"desc"}).then((movieData)=>{
        console.log("Movies: ",movieData);
        res.render("home", {movieData,user});
      })
      .catch(err=>{
        console.log("Error: ",err);
      });
  });

  app.get("/:title",(req,res)=>{       
    const { title } = req.params; 
    console.log(title);   
    var user = req.signedCookies["user_id"];    
      myts.listMovies({query_term:title}).then((movieData)=>{
        console.log("Movies: ",movieData);
        res.render("home", {movieData,user});
      })
      .catch(err=>{
        console.log("Error: ",err);
      });
  });

  app.get("/g/:genre",(req,res)=>{       
    const { genre } = req.params; 
    var user = req.signedCookies["user_id"];    
      myts.listMovies({genre:genre}).then((movieData)=>{
        console.log("Movies: ",movieData);
        res.render("home", {movieData,user});
      })
      .catch(err=>{
        console.log("Error: ",err);
      });
  });

  app.get("/movie/:id", (req,res)=>{
    const { id } = req.params;    
    var user = req.signedCookies["user_id"];
    UserRatings.calculateAverage(id,user,res, ()=>{
      var average = res.data.average;
      var userHasVoted = res.data.userHasVoted;
      var averageStars = `${average} star(s)`;

      myts.movieDetails({movie_id:id}).then((movie)=>{
        
        console.log("User: "+ user + ", user voted: " + userHasVoted);
        res.render("movie", {movie, user, averageStars, userHasVoted});
      })
      .catch(err=>{
        console.log("Error: ",err)
      })
    });
  });

  app.post("/moviebytitle", (req,res)=>{ 
    var user = req.signedCookies["user_id"];   

    myts.listMovies({query_term:req.body.title}).then((movies)=>{
      if(movies.length == 1){
        var movie = movies[0];
        console.log(movie.id);      
        res.end(`${movie.id}`);
      }
      else{
        res.end("Get Search Results");
      }
    });
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.authUser(req,res, email,password, 
      ()=>{      
        res.redirect("/");
      },
      ()=>{        
        res.render("login",{message:"Incorrect email or password"});
      });

    // if the user auths, let them in
    // if not, give them error
  });

  app.get("/logout", (req, res) => {
    // do something with our tokens
    unsetAuthToken(req,res);
    res.redirect("/login");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.post("/signup", (req, res) => {
    // if reg is valid, show a message and redirect to login   

      var user = {
        firstname:req.body.firstname,
        surname:req.body.surname,
        email:req.body.email,
        password:req.body.password
      }
      User.createUser(req,res, user, 
        ()=>{      
          res.redirect("/");
        });
  });

  app.post("/userRating", (req,res) =>{

    var user = req.signedCookies["user_id"];

    console.log(req);

    var movieRating = {
      ID_user: user,
      movie_ID:req.body.movieId,
      starRating: req.body.starRating
    };

    UserRatings.addRating(movieRating,
      ()=>{
        console.log("Rated");
      });

      res.end('{"success" : "Updated Successfully", "status" : 200}');
  });

  
};
