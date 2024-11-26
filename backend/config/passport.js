import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import db from 'firebase.js';  // Import Firestore configuration
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

            const userQueryRef = db.collection('customers').where('email', '==', email);  // Renamed to avoid conflict
            const userSnapshot = await userQueryRef.get();

            if (!userSnapshot.empty) {
                const user = userSnapshot.docs[0].data();
                return done(null, user);
            }

            const newUser = {
                email,
                username: `${profile.name.givenName} ${profile.name.familyName}`,
                facebookId: profile.id,
                profilePicture,
            };

            const newUserRef = await db.collection('customers').add(newUser);  // Renamed to avoid conflict

            const createdUser = { ...newUser, id: newUserRef.id };
            return done(null, createdUser);

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
        const userRef = db.collection('customers').doc(id);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            done(null, userDoc.data());
        } else {
            done(new Error('User not found'), null);
        }
    } catch (error) {
        done(error, null);
    }
});

export default passport;
