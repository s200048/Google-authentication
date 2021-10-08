const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
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

// Google Strategy
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
                        email: profile.emails[0].value,
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


//Local Stragety (by myself with async)
// passport.use(
//     new localStrategy(
//         async (email, password, done) => {
//             let foundUser = await User.findOne({email: email});
//             console.log("Found user.", foundUser);
//             try{
//                 if (!foundUser){
//                     console.log("email not exist");
//                     return done(null, false, { message: 'Incorrect username.' });
//                 } else {
//                     console.log("email exist.");

//                     let notHash = await bcrypt.compare(password, foundUser.password);
//                     console.log("Not hash password: ",notHash);
//                     if (notHash === true) {
//                         console.log("user pw correct.");
//                         return done(null, foundUser);
//                     } else {
//                         console.log("user password fail.");
//                         return done(null, false, { message: 'Incorrect password.' });
//                     }
//                 }
//             } catch(err) {
//                 console.log(err);
//                 console.log("Something go wrong.");
//             }
//         }
//     )
// )

// by .then

passport.use(
    new localStrategy(
        (username, pw, done) => {
            User.findOne({email: username})
            .then((foundUser) => {
                console.log("Found User.")
                if(!foundUser){
                    console.log("User not exist.")
                    return done(null, false);
                }
                bcrypt.compare(pw, foundUser.password).then((comHash) => {
                    console.log("Dehash pw.")
                    if(comHash === true){
                        console.log("pw correct.")
                        return done(null, foundUser);
                    } else{
                        console.log("pw fail.")
                        return done(null, false);
                    }
                }).catch((err) => {
                    console.log(err())
                })
            }).catch((err) => {
                console.log(err);
            })
        }
    )
)