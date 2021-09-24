const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-foute");
const cookieSession = require("cookie-session");
const passport = require("passport");
dotenv.config();
//唔洗const variable, 因為佢就等於 passport.js --> passport.use paste 落呢到
const ppConfig = require("./config/passport");

mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }   
).then(() => {
    console.log("Connecting to mongodb atlas.");
}).catch((err) => {
    console.log("Fail connet to mongodb atlas.");
    console.log(err);
});

//middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
    keys: [process.env.SECRET],
}));
app.use(passport.initialize());
app.use(passport.session());


//Node.js收到任何request，都會Check request入邊有冇/auth， 有就入authRoute，再睇/login or /google
app.use("/auth", authRoute);
app.use("/profile", profileRoute);
// app.use((req,res,next) => {
//     console.log(req.method, req.url, req.path);
//     next();
// });


app.get("/", (req,res) => {
    res.render("index", {user: req.user});
    // console.log(req.session.passport.user);
    // console.log(passport.user);//undefined
    // console.log(req.user);
});

// Missing the /auth --> cannot reach the logout route
// app.get("/logout", (req,res) => {
//     req.logOut();
//     res.redirect("/");
// });



app.listen(8000, () => {
    console.log("Server is running on Port 8000.");
});