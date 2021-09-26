const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

// router.use((req,res,next) => {
//     console.log(req.method, req.url, req.path);
//     next();
// });

router.get("/login", (req,res) => {
    res.render("login", {user: req.user});
    // console.log(process.env.GOOGLE_CLIENT_ID);
    // console.log(process.env.GOOGLE_CLIENT_SECRET);
});

//Sign up
router.get("/signup", (req,res) => {
    res.render("signup", {user: req.user});
});

// router.post("/signup", (req,res,next) => {
//     let newUser = req.body;
//     bcrypt.hash(newUser.password, 10, (err, hash) => {
//         if(err) {
//           next(err);
//         }
//         newUser.password = hash
//         console.log(newUser.password);
//         console.log("This is One");

//         User.findOne({email: newUser.email})
//         .then((SavingUser) => {
//             if(SavingUser) {
//                 console.log(`This ID is already existed in MongoDB.`);
//             res.redirect("signup");
//             } else {
//                 new User({
//                     name: newUser.name,
//                     email: newUser.email,
//                     password: newUser.password,
//                 }).save().then((newSavedUser) => {
//                     console.log("Saved user: ", newSavedUser);
//                     console.log(`This user was saved in MongoDb now.`);
//                 }).catch((err) => { 
//                     console.log(err);
//                 });
//                 res.redirect("/profile");
//                 // res.status(200).send({msg:"User received."});
//             }
//         }).catch((err) => {
//             console.log(err);
//         })
//     })
//     console.log("This is Two");
// })

router.post("/signup", async(req,res) => {
    let { name, email, password } = req.body;
    const emailExist = await User.findOne({email});
    if (emailExist) return res.status(400).send("Email already exist.")

    const hash = await bcrypt.hash(password, 10);
    password = hash;
    let newUser = new User({name, email, password});

    console.log("This is one");
    try {
        console.log("This is two.");
        const savedUser = await newUser.save();
        res.status(200).send({
            msg:"User saved.",
            savedObj: savedUser,
        });
        console.log(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
    console.log("This is three.");
})


// Logout
router.get("/logout", (req,res) => {
    req.logOut();
    res.redirect("/");
})

//rewrite
// router.get("/google", (req,res) =>{
//     passport.authenticate("google", {
//         scope: ["profile"],         //authenticate user後，想拎到user info.
//     });
// });




router.get("/google", 
    // 呢個係middleware(only for this route) --> 唔用req,res
    //呢到會去返passport.js 睇下有冇googleStrategy，再睇.env 果啲value
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

router.get("/google/redirect", passport.authenticate("google", {failureRedirect: "/login"}), 
    (req,res) => {
        res.redirect("/profile");
    }
);

module.exports = router;