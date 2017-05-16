var express= require("express");
var bodyParser = require("body-parser");
var app =express();
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var port = process.env.PORT || 8080 ;
var mongoose = require("mongoose");
var image = require("./models/image");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/myDatabase');
mongoose.Promise = global.Promise;

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

passport.use(new Strategy({
  consumerKey: "Ik0XJT3zd2E37qI6GXm1ZrMIE",
  consumerSecret: "WDK2oUs2GSgsmEBX7gwOlxOG9H3dPHQPDMp0aPxPpd2szBovx2",
  callbackURL: 'https://pinterest-clone-nmaddp.herokuapp.com//login/twitter/return'
},
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
}));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// data for test : 

// var data = new image ({
//   userID : "848456410375397376",
//   url : "https://moesocial.com/uploads/photos/thumbnail/2017/02/12/33810/1500_ca42cf4de91c887f50ada469bbc27f66.jpg",
//   description : "Sword art online 1",
//   userAvatar : "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" ,
//   listUserLike: []
// });
// data.save(function(err){
//   console.log("add success");
//   if(err) console.log(err);
// })

// ava = user.photos[0].value




app.get('/',function(req,res){
  // if(req.user) console.log(req.user);
  res.render('home',{user:req.user});

})

app.get('/login',
        passport.authenticate('twitter'));

app.get('/login/twitter/return', 
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function(req, res) {
  res.redirect('/');

});


app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/get-all-image',function(req,res){
  image.find({},function(err,data){

    if(err) console.log("Err");
    
    res.send(data);
  });
})

app.get('/add-pic',function(req,res){
  if (req.user)
    res.render("add-pic",{user:req.user});
  else {
    res.redirect('/');
  }
})
app.get('/add',function(req,res){
  var description = req.query.description;
  var url = req.query.url;
  var userID = req.user.id;
  var userAvatar = req.user.photos[0].value;
  var listUserLike = [];
  var data = new image({
    userID : userID ,
    url : url ,
    description : description ,
    userAvatar : userAvatar ,
    listUserLike : listUserLike
  });
  data.save(err=>{
    if(err) console.log(err);
  })
  res.redirect('/');
})

app.get('/my-pic',function(req,res){
  if(req.user){
    res.render("my-pic",{user:req.user});
  } else {
    res.redirect("/");
  }
})

app.get('/get-my-pic',function(req,res){
  var userID = req.user.id;
  image.find({
    userID : userID 
  },function(err,data){
    if(err) console.log(err);
  
    res.send(data);
  })
});



app.get('/delete',function(req,res){
  var id =req.query.id ;
  image.find({ _id:id }).remove().exec();
  res.redirect('/my-pic');
});


app.get('/browse-pic',function(req,res){
  var userID = req.query.id ;
  if(req.user){
    if(userID == req.user.id){
      res.redirect('/my-pic');

    } 
  }else {
    
    //res.render('browse-pic',{user:req.user});
    res.render('browse-pic',{user:req.user,id : userID});
  }
});

app.get('/get-pic-user',function(req,res){
  var userID = req.query.id ;
  // console.log(userID);
  image.find({
    userID : userID 
  },function(err,data){
    // console.log(data);
    if(err) console.log(err);
    res.send(data);
  })
})

app.listen(port,function(){
  console.log("Server is running ");

})

// image.remove({}, function(){}); 

// image.find({},function(err,data){
//     console.log(data);
// })