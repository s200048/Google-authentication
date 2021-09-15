const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req,res) => {
    res.render("login");
});

router.get("/google", (req,res) =>{
    passport.authenticate("google", {
        scope: ["profile"],         //authenticate user後，想拎到user info.
    });
});

module.exports = router;