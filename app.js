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
    res.render('operator_profile/operator', data);
  // })
  } else {
    res.render('home/index');
  }
})

//Render all Androids to one page
app.get('/androids/', function(req, res){
  var data;

  if(req.session.operator){
       data = {
      "logged_in": true,
      "email": req.session.operator.email
      };

    db
       .any("SELECT * FROM androids")
       .then(function(info){
          androids_array = {
           androids: info,
           security: data
          }

        res.render('androids/allandroids', androids_array)
     })
    // res.render('profile/portfolio', data);
  } else {
    res.render('home/index');
  }
})


//Render add_new_android form
app.get('/add_new_android', function(req, res){
  var data ;
  if(req.session.operator){
    data = {
      "logged_in": true,
      "email": req.session.operator.email
    };
    res.render('androids/add_new_android', data);
  } else {
    res.render('home/index');
  }
});

// Register a new Android
app.post('/add_new_android', function(req,res){
  var data;
  if(req.session.operator){
    console.log(req.body);
    data = req.body;

                db.none(
                  "INSERT INTO androids (name, avatar, skills, reliability, status, job_id) VALUES ($1, DEFAULT, $2, DEFAULT, $3, DEFAULT)",
                  [data.name, data.skills, data.status]
                ).catch(function(e){
                  res.send('Failed to register: ' + e + 'Please go back and try again');

                }).then(function(){
                  // res.render('profile/portfolio', data);
                  res.redirect("/androids");
                });

       } else {
          res.render('home/index');
       }
  });

  // Delete an Android
  app.delete('/delete_android/:id', function(req, res){
    console.log(req.params.id)
        var id = req.params.id;
        if(req.session.operator){
          db.none(
              "DELETE FROM androids WHERE id = $1", id
          ).then(function(){
          res.redirect("/androids");
          });

        } else {
          res.render('home/index');
        }
  })


  //Render update_android form
  app.get('/update_android/:id', function(req, res){
    var data ;
    var id = req.params.id;
    console.log(id);
    if(req.session.operator){
      data = {
        "logged_in": true,
        "email": req.session.operator.email,
        "id": id
      };
      res.render('androids/update_android', data);
    } else {
      res.render('home/index');
    }
  });


  //Update Android info
  app.put('/update_android/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    var data = req.body;
    db
      .none("UPDATE androids SET name = $1 WHERE id = $2",
        [data.name, id]
      ).catch(function(){
        res.send('Failed to update android. Please go back and try again.');
      }).then(function(){
        res.redirect("/androids");
        // res.send('User updated.');
      });

  });


//Logout
app.get('/logout', function(req, res){
  req.session.operator = false;
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server running, listening on port 3000!');
});
