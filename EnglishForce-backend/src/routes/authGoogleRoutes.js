import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import express from "express";
import { OAuthCallback } from '../controllers/authController.js';


dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: '/api/auth_google/google/callback'
    callbackURL: 'https://elearning-be-water.onrender.com/api/auth_google/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        const Googleuser = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            role: "user",
        };

        done(null, Googleuser);
    }
));


const router = express.Router();


//OAuth 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    OAuthCallback
);

export default router ;