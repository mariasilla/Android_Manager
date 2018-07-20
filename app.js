//NPM packages
const express = require('express');
const app = express();
const methodOverride = require('method-override')
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const path = require('path');
//Bcrypt
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

//configuration of packages
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(express.static('uploads'))

//configuration of session package
app.use(session({
  secret: 'android',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


//connect to android_manager database
var db = pgp('postgres://kuzia@localhost:5432/android_manager');

//render Home page
app.get('/', function(req, res){
  res.render('home/index');
});

// Operator Authentication
app.post('/login', function(req, res){
  var data = req.body;
  var auth_error = "Authorization Failed: Invalid email/password. Please go back and try again.";

  db
    .one("SELECT * FROM operators WHERE email = $1", [data.email])
    .catch(function(){
      res.send(auth_error);
    })
    .then(function(operator){
      bcrypt.compare(data.password, operator.password_digest, function(err, cmp){
        if(cmp){
          // console.log(user);
          req.session.operator = operator;
          res.redirect("/operator_profile/");
        } else {
          res.send(auth_error);
        }
      });
    });
 });





//render user sign-up
app.get('/signup', function(req, res){
  res.render('signup/index');
});

//Operator sign-up
app.post('/signup', function(req, res){
  var data = req.body;
  bcrypt
    .hash(data.password, 10, function(err, hash){
      db.none(
        "INSERT INTO operators (email, password_digest) VALUES ($1, $2)",
        [data.email, hash]
      ).catch(function(e){
        res.send('Failed to create user: ' + e);

      }).then(function(){
        // res.send('User created!');
        res.redirect("/");
      });
    });
});

//render operator_profile page
app.get('/operator_profile/', function(req, res){
  var data ;
  if(req.session.operator){
    data = {
      "logged_in": true,
      "email": req.session.operator.email
    };
   //  console.log(data.zipcode);
    //https://api.meetup.com/2/open_events?key=125567365e1835372f462b14a4a2d41&sign=true&photo-host=public&zip=10003&text=painter&page=20
    // var url = 'https://api.meetup.com/2/open_events?key=125567365e1835372f462b14a4a2d41&sign=true&photo-host=public&zip=';
    // var search = '&text=painting&page=20';
   //  var url = 'https://api.meetup.com/find/events?key=125567365e1835372f462b14a4a2d41&sign=true&photo-host=public&text=painter&page=20';
   //display API's data according to user's zipcode
    // axios.get(url+data.zipcode+search)
    // .then(function(response){
     //  data.meetup = response.data
      // data.meetup = response.data.results
    //  console.log(data.meetup);
    res.render('operator_profile/operator', data);
  // })
  } else {
    res.render('home/index');
  }
})





app.listen(process.env.PORT || 3000, function () {
  console.log('Server running, listening on port 3000!');
});
