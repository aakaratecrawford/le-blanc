var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var {check,validationResult} = require('express-validator/check');
var mongojs = require('mongojs');
var db = mongojs('secret-santa', ['users']);

var app = express();

// View engines
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Body Parse middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set static path
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  // find everything
  db.users.find(function (err, users) {
    console.log(users);
    res.render('index',{
      title: 'Customers',
      users:users
    });
  })
});

app.post('/users/add', [
  // email must be email
  check('email').not().isEmpty(),
  check('first_name').not().isEmpty(),
  check('last_name').not().isEmpty(),
  check('email').isEmail()
],(req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json({errors:errors.array()});
  }
  var newUser = {
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email
  }
  db.users.insert(newUser, function(err,result){
    if (err){
      console.log(err);
    }
    res.redirect('/');
  });
  console.log(newUser);

});

// Finally listen on available port
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
