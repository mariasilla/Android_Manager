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


connect to android_manager database
var db = pgp('postgres://kuzia@localhost:5432/android_manager');

//connect to heroku database
// var herokuDb = 'postgres://xnuaznegmxejfo:f74da890eb918ea5f39c60b68aa321c6b46a1d78aae48783863bbcd71562d111@ec2-23-23-247-222.compute-1.amazonaws.com:5432/d88l1cspi6sssj';
// var db=pgp(herokuDb);

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

      // db
      //  .any("SELECT * FROM jobs")
      //  .then(function(info){
      //     jobs_array = {
      //      jobs: info,
      //      security: data
      //     }
      // console.log(jobs_array);
      // res.render('androids/update_android', jobs_array);
        res.render('androids/update_android', data);
      //  })

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

      });

  });

//*********************************************************************
  //Render all Jobs to one page
  app.get('/jobs/', function(req, res){
    var data;

    if(req.session.operator){
         data = {
        "logged_in": true,
        "email": req.session.operator.email
        };

      db
         .any("SELECT * FROM jobs")
         .then(function(info){
            jobs_array = {
             jobs: info,
             security: data
            }

          res.render('jobs/alljobs', jobs_array)
       })

    } else {
      res.render('home/index');
    }
  })

  //Render add_new_job form
  app.get('/add_new_job', function(req, res){
    var data ;
    if(req.session.operator){
      data = {
        "logged_in": true,
        "email": req.session.operator.email
      };
      res.render('jobs/add_new_job', data);
    } else {
      res.render('home/index');
    }
  });

  // Add a new Job
  app.post('/add_new_job', function(req,res){
    var data;
    if(req.session.operator){
      console.log(req.body);
      data = req.body;

                  db.none(
                    "INSERT INTO jobs (name, description, complexity) VALUES ($1, $2, $3)",
                    [data.name, data.description, data.complexity]
                  ).catch(function(e){
                    res.send('Failed to add a job: ' + e + 'Please go back and try again');

                  }).then(function(){
                    // res.render('profile/portfolio', data);
                    res.redirect("/jobs");
                  });

         } else {
            res.render('home/index');
         }
    });

    // Delete a Job
    app.delete('/delete_job/:id', function(req, res){
      console.log(req.params.id)
          var id = req.params.id;
          if(req.session.operator){
            db.none(
                "DELETE FROM jobs WHERE id = $1", id
            ).then(function(){
            res.redirect("/jobs");
            });

          } else {
            res.render('home/index');
          }
    })

    //Render update_job form
    app.get('/update_job/:id', function(req, res){
      var data ;
      var id = req.params.id;
      console.log(id);
      if(req.session.operator){
        data = {
          "logged_in": true,
          "email": req.session.operator.email,
          "id": id
        };
        res.render('jobs/update_job', data);
      } else {
        res.render('home/index');
      }
    });

    //Update Job info
    app.put('/update_job/:id', function(req, res){
      var id = req.params.id;
      console.log(id);
      var data = req.body;
      db
        .none("UPDATE jobs SET name = $1,description = $2, complexity = $3 WHERE id = $4",
          [data.name, data.description, data.complexity, id]
        ).catch(function(){
          res.send('Failed to update a job. Please go back and try again.');
        }).then(function(){
          res.redirect("/jobs");

        });

    });

//********************************************************************************
//Logout
app.get('/logout', function(req, res){
  req.session.operator = false;
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server running, listening on port 3000!');
});
