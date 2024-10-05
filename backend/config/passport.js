import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../model/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name', 'photos'] // Fetch email, name, and photos
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const profilePicture = profile.photos[0].value; // Get profile picture URL

            // Check if user already exists by email
            const user = await User.findOne({ email });
            if (user) {
                return done(null, user);
            }

            // If new user, create and save in DB
            const newUser = new User({
                email,
                username: `${profile.name.givenName} ${profile.name.familyName}`,
                facebookId: profile.id,  // Store Facebook ID for future reference
                profilePicture,           // Save the profile picture URL
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, false);
        }
    }
));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
