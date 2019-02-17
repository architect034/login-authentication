const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Tasks} = require('./models/task');
const bcrypt = require('bcryptjs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var db = mongoose.connection;

app.use('/styles',express.static('styles')); //for static files ie style.css

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
}));


app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: false }));

//Get for Home Page
app.get('/',(req,resp)=>{
    resp.render('home');
});

//GET for login page
app.get('/login',(req,resp)=>{
    resp.render('login');
});

//GET for register page
app.get('/register',(req,resp)=>{
    resp.render('register');
});

//POST for register
app.post('/register',(req,resp)=>{
    var userData = new User({
        username: req.body.username,
        email:req.body.email,
        password:req.body.password
    });
    User.findOne({email:req.body.email}).exec((err,res)=>{        
        if(err){
            res.status(404).send();
        }else{
            if(!res){
                userData.save((err)=>{
                    resp.status(401).send();
                });
                if(req.body.password === req.body.password2){
                    resp.render('success',{data:req.body})
                }else{
                    resp.render('pdm')
                }
            }else{
                resp.render('failreg',{data:req.body});
            }
            
        }
    });
});

//POST for login
app.post('/login',(req,resp)=>{
    User.findOne({email:req.body.email}).exec((err,res)=>{
        console.log(res);
        
        if(err || !res){
            resp.render('notRegistered',{data:req.body});
        }else{
            var inPassword = req.body.password;
            var hashedPassword = res.password;
            bcrypt.compare(inPassword,hashedPassword,(err,response)=>{
                if(response === true){
                    req.session.userId = res._id;
                    if(req.body.email === 'gobindsingh034@gmail.com'){
                        // console.log('Aya');
                        resp.render('askUserAdmin');
                    }else{
                        resp.redirect('/profile');
                    }
                }else {
                    resp.render('loginfail');
                }
            });
        }
    });
});

//GET Login as User
app.get('/login/admin',(req,resp)=>{
    User.findById(req.session.userId).exec((err,res)=>{
        if(err || !res){
            resp.status(400).send();    //Find All Data of User
        }else{
            User.find({}).exec((err,ress)=>{
                if(err || !ress){
                    res.status(404).send();
                }else{
                    Tasks.find({}).exec((err,resss)=>{ 
                        if(err || !resss){
                            resp.status(400).send();       // Line 91-97 responsible for showing Tasks
                        }else{
                            // console.log(resss);
                            
                            resp.render('loggedAsAdmin',{data:res,userArray:ress,taskArray:resss});
                        }
                    });
                }
            });
        }
    });
    
});

//GET profile
app.get('/profile',(req,resp)=>{
    User.findById(req.session.userId).exec((err,res)=>{
        if(err || !res){
            resp.status(400).send();    //Find All Data of User
        }else{
            Tasks.find({email:res.email}).exec((err,ress)=>{ 
                if(err || !ress){
                    resp.status(400).send();       // Line 91-97 responsible for showing Tasks
                }else{
                    resp.render('logged',{data:res,arr:ress});
                }
            });
        }
    });
});

//GET logout
app.get('/logout',(req,resp,next)=>{
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
            return next(err);
            } else {
            return resp.redirect('/');
            }
        });
    }
});

//POST profile
app.post('/profile',(req,resp)=>{
    var task = new Tasks({
        email:req.body.email,
        text:req.body.text
    });
    task.save((err)=>{
        resp.status(400).send();
    });
    resp.redirect('/profile');
});

//Get delete
app.get('/delete',(req,resp)=>{
    User.findById(req.session.userId).exec((err,res)=>{
        if(err || !res){
            resp.status(400).send();    //Find All Data of User
        }else{
            Tasks.find({email:res.email}).exec((err,ress)=>{ 
                if(err || !ress){
                    resp.status(400).send();       // Line 91-97 responsible for showing Tasks
                }else{
                    resp.render('deleteAsUser',{data:res,arr:ress});
                }
            });
        }
    });
});

app.post('/delete',(req,resp)=>{
    console.log(req.body);
    Tasks.findOneAndRemove({_id:req.body.id}).exec((err,res)=>{        
        if(err || !res){
            console.log('Hey bro');
            
            resp.status(400).send();
        }else{
            resp.redirect('/profile');
        }
    });
});


app.listen(8555,()=>{
    console.log('Listening on port 8555');
    
});
