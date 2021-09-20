const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
// const { deleteOne } = require("../models/user-model");
const User = require("../models/user-model");

// passport.serializeUser((user, done) => {
//     console.log("Serializing user now");
//     done(null, user._id);
// });

// passport.deserializeUser((_id, done) => {
//     console.log("Deserializing user now");
//     User.findById({ _id }).then((user) => {
//         console.log("Fund user.");
//         done(null, user);
//     });
// });


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
                    console.log("Finding use: ", name);
                    console.log(`${name}is already existed in MongoDB.`);
                    callback(null, name);
                } else {
                    new User({
                        name: profile.displayName,
                        googleID: profile.id,
                        thumbnail: profile.photos[0].value,
                    }).save().then((newUser) => {
                        console.log("Saved message: ", newUser);
                        console.log(`Saved ${newUser} in MongoDb now.`);
                        callback(null, newUser);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
            
            // console.log("accessToken: ", accessToken);
            // console.log("refreshToken: ", refreshToken);
            // console.log("profile: ", profile.photos[0].value);
            // console.log(profile);
            // console.log("callback: ", callback);
        }
    )    
);