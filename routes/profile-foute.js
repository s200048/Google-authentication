const router = require("express").Router();

const isAuthenticated = (req,res,next) =>{
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) {
        res.redirect("/auth/login");
        // console.log("Redirect to /");
    } else {
        next();
        // console.log(req.user);
    }
}

router.get("/", isAuthenticated, (req,res) => {
    res.render("profile", {user: req.user});
});

module.exports = router;