import createHttpError from "http-errors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import helmet from 'helmet';
import session from 'express-session';
import bcrypt from 'bcrypt';
import flash from 'connect-flash';
//for typeorm
import {getRepository} from "typeorm";
import { User } from "./entities/User";

import dotenv from "dotenv";
dotenv.config();

import passport, { Profile } from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy, VerifyFunction } from "passport-google-oauth";

import { router as indexRouter } from "./routes/index";
import { router as usersRouter } from "./routes/users";
import { escapeHTML } from "./util/userFunc";

//perform connection

const userRepository = getRepository(User);

passport.use(new LocalStrategy({
  usernameField: 'mail_address',
  passwordField: 'password'
  },
  function(mail_address: string, password: string, done: Function){
    try{
      userRepository.findOne({mail_address: mail_address}).then(user => {
        let error: boolean = false;
        //mail address not found
        if (!user) error = true;
        //password not found
        if (!bcrypt.compareSync(password, user!.password)) error = true;
        if (error) return done(null, false, {message: 'メールアドレスもしくはパスワードに誤りがあります。'});
        return done(null, user);
      });
    }catch(err){
      return done(err, false, {message: '認証エラーが発生しました。[E-001]'});
    }
  }
));
passport.use('local-signup', new LocalStrategy({
  usernameField: 'mail_address',
  passwordField: 'password'
  },
  function(mail_address: string, password: string, done: Function){
    try{
      if (!mail_address || !password) return done(null, false, {message: 'メールアドレスとパスワードを必ず入力してください。'});
      userRepository.findOne({mail_address: mail_address}).then(user => {
        if (user) return done(null, false, {message: 'お使いのメールアドレスは既に登録されています。'});
        const newUser = new User();
        const hashedPassword = bcrypt.hashSync(password, 10);
        newUser.mail_address = mail_address;
        newUser.password = hashedPassword;
        newUser.google_id = '';
        newUser.display_name = mail_address.split('@')[0];
        newUser.is_active = true;
        newUser.is_admin = false;
        userRepository.save(newUser).then(registered => {
          if (registered){
            return done(null, user);
          }else{
            return done(null, false, {message: '登録エラーが発生しました。[E-002]'});
          }
        });
      });
    }catch(err){
      return done(err, false, {message: '認証エラーが発生しました。[E-003]'});
    }
  }
));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'default_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'default_secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/users/login_google_callback'
  }, function (accessToken: String, refreshToken: String, profile: Profile, done: VerifyFunction){
    let user: any;
    if (profile){
      userRepository.findOne({google_id: profile.id}).then(user => {
        if (user){
          user.display_name = profile.displayName;
          userRepository.save(user);
        }else{
          user = new User();
          user.mail_address = '';
          user.password = '';
          user.google_id = profile.id;
          user.display_name = profile.displayName;
          user.is_active = true;
          user.is_admin = false;
          userRepository.save(user).then(newUser => {
            user = newUser;
          });
        }
        return done(null, user);
      });
    }else{
      return done(null, false, {message: '認証エラーが発生しました。[E-004]'});
    }
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user: any, done) {
  done(null, user);
});

const app = express();


// view engine setup
app.set("views", "views");
app.set('view engine', 'pug');

//helper function in pug
app.locals.escapeHTML = escapeHTML;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: true,
  saveUninitialized: false,
}));

app.use(flash());
app.use(helmet(
  {contentSecurityPolicy:{
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://kit.fontawesome.com",
        "https://ka-f.fontawesome.com"
      ],
      "connect-src": [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://kit.fontawesome.com",
        "https://ka-f.fontawesome.com"
      ]
    }
  }}
));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createHttpError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
