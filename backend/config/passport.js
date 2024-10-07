import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../model/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name', 'photos']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const profilePicture = profile.photos[0].value;

            const user = await User.findOne({ email });
            if (user) {
                return done(null, user);
            }

            const newUser = new User({
                email,
                username: `${profile.name.givenName} ${profile.name.familyName}`,
                facebookId: profile.id,
                profilePicture,
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, false);
        }
    }
));

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
