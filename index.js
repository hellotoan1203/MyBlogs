const express = require('express');
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const blogRouter = require('./router/admin/blogRouter')
const publicRouter = require('./router/public/publicRouter')

const port = process.env.PORT || 3000

app.set('views','./views');
app.set('view engine','ejs');


//use midleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'NgoHuuToan'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))



//Config Passport
app.route('/login')
.get((req,res)=>{
    res.render('admin/login');
})
.post(passport.authenticate('local',{failureRedirect: '/login', successRedirect:'/admin/blog'}));

app.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/login')
})

passport.use(new LocalStrategy( (username,password,done)=>{
    if(username == "admin" && password == "admin12031997."){
        done(null, {username: "admin", role: "1",userID: "12031997"});
    }else{
        done(null,false);
    }
}))

passport.serializeUser((user,done)=>{
    done(null,user.userID);
});

passport.deserializeUser((id, done)=>{
    if(id==="12031997"){
        done(null,{username: "admin", role: "1",userID: "12031997"});
    }else{
        done(null,false);
    }
})

//Router
app.use('/admin/blog', blogRouter);
app.use('/', publicRouter )


app.listen(port,()=>{
    console.log('app running');
})