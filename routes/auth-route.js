const router = require("express").Router();
const passport = require("passport");

// router.use((req,res,next) => {
//     console.log(req.method, req.url, req.path);
//     next();
// });

router.get("/login", (req,res) => {
    res.render("login", {user: req.user});
    // console.log(process.env.GOOGLE_CLIENT_ID);
    // console.log(process.env.GOOGLE_CLIENT_SECRET);
});

//
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