const router = require("express").Router();
const Post = require("../models/post-model");
const User = require("../models/user-model");

const authCheck = (req,res,next) =>{
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) {
        res.redirect("/auth/login");
        // console.log("Redirect to /");
    } else {
        next();
        // console.log(req.user);
    }
}

router.get("/", authCheck, (req,res) => {
    res.render("profile", {user: req.user});
});

// post page
router.get("/post", (req,res) => {
    res.render("post", {user: req.user});
})

router.post("/post", authCheck, async (req,res) => {
    let {title, content} = req.body;
    
    let newPost = new Post({title: title,content: content, author: req.user._id});
    try {
        await newPost.save();
        console.log(newPost);
        res.redirect("/profile");
    } catch(err) {
        console.log(err);
        req.flash("error_msg", "Both title and content are required.");
        res.redirect("/profile/post");
    }

})


module.exports = router;