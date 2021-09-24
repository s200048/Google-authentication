const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
// const { deleteOne } = require("../models/user-model");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
    console.log("Serializing user now");
    // console.log(user);
    // 要加埋_id --> 因為不論咩log in save 左之後都係變左_id
    done(null, user._id);
    // console.log(done);
    // console.log(user._id, user.name);
});

passport.deserializeUser((_id, done) => {
    console.log("Deserializing user now");
    User.findById({ _id }).then((user) => {
        console.log("Found user.");
        done(null, user);
    }).catch((err) => {
        console.log(err);
    });
});

passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect",
        },
        (accessToken, refreshToken, profile, callback) => {
            // Google passport callback
            User.findOne({googleID: profile.id}).then((name) => {
                if (name){
                    // console.log("Finding user: ", name);
                    console.log(`This ID is already existed in MongoDB.`);
                    callback(null, name);
                } else {
                    new User({
                        name: profile.displayName,
                        googleID: profile.id,
                        thumbnail: profile.photos[0].value,
                    }).save().then((newUser) => {
                        console.log("Saved message: ", newUser);
                        console.log(`Saved this user in MongoDb now.`);
                        callback(null, newUser);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
            // console.log(profile);
            // console.log("callback: ", callback);
        }
    )    
);