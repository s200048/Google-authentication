const router = require("express").Router();
const passport = require("passport");

// router.use((req,res,next) => {
//     console.log(req.method, req.url, req.path);
//     next();
// });

router.get("/login", (req,res) => {
    res.render("login");
    // console.log(process.env.GOOGLE_CLIENT_ID);
    // console.log(process.env.GOOGLE_CLIENT_SECRET);
});

//rewrite
// router.get("/google", (req,res) =>{
//     passport.authenticate("google", {
//         scope: ["profile"],         //authenticate user後，想拎到user info.
//     });
// });

router.get(
    "/google", 
    // 呢個係middleware --> 唔用req,res
    passport.authenticate("google", {       //呢到會去返passport.js 睇下有冇googleStrategy，再睇.env 果啲value
        scope: ["profile"],
    })
);

router.get("/google/redirect", passport.authenticate("google"), (req,res) => {
    res.redirect("/profile");
});

module.exports = router;