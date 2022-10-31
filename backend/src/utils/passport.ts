import userModel, { IUser } from "../models/user.model";
import passport from 'passport'
import * as passportLocal from 'passport-local'
import bcrypt from 'bcrypt'

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser(async (user: any, done: any) => {
    done(null , user);
});


passport.use(new LocalStrategy(
    (email, password, done) => {
        userModel.findOne({ email }, async (err: any, user: IUser) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verified) { return done(null, false); }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) { return done(null, false); }
            return done(null, user);
        });
    }
))