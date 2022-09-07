const express       = require("express");
const session       = require("express-session");
const exphbs        = require('express-handlebars');
const mongoose      = require("mongoose");
const passport      = require("passport");
const localStrategy = require('passport-local');
const bcrypt        = require('bcrypt');
const MongoStore    = require("connect-mongo")(session);
const flash         = require("express-flash");
const logger        = require("morgan");
const app           = express();
const jwt           = require("jsonwebtoken");
const connectDB     = require("./config/database");



require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//app.use(flash());


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login')
}

function isLoggedOut(req, res, next){
  if(!req.isAuthenticated()) return next();
  res.redirect('/logout')
}



//Routes
app.get('/', isLoggedIn,  (req, res) => {
  res.render("index", {title: "Home"})
});

app.get('/login', isLoggedOut, (req, res) => { 

  const response = {
    title: "Login",
    error: req.query.error
  }

  res.render('login', response)
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?error=true'
}));


app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});


//Setup Our admin

app.get('/setup', async(req, res) =>{
  const exists = await User.exists({ username: "admin" });

  if(exists) {
    
      res.redirect('/login');
      return;
  };

  bcrypt.genSalt(10, function(err, salt){
      if(err) return next(err);
      
      bcrypt.hash("pass", salt, function(err, hash) {
          if(err) return next(err);

          const newAdmin = new User({
              username: "admin",
              password: hash
          });
          newAdmin.save();

          res.redirect('/login')
      } )
  })
})


app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
