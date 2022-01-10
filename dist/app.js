"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connect_flash_1 = __importDefault(require("connect-flash"));
//for typeorm
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth_1 = require("passport-google-oauth");
const index_1 = require("./routes/index");
const users_1 = require("./routes/users");
const userFunc_1 = require("./util/userFunc");
//perform connection
const userRepository = (0, typeorm_1.getRepository)(User_1.User);
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'mail_address',
    passwordField: 'password'
}, function (mail_address, password, done) {
    try {
        userRepository.findOne({ mail_address: mail_address }).then(user => {
            if (!user)
                done(null, false, { message: 'mail address error' });
            if (!bcrypt_1.default.compareSync(password, user.password)) {
                done(null, false, { message: 'password error' });
            }
            return done(null, user);
        });
    }
    catch (err) {
        return done(err, false, { message: 'auth error' });
    }
}));
passport_1.default.use('local-signup', new passport_local_1.Strategy({
    usernameField: 'mail_address',
    passwordField: 'password'
}, function (mail_address, password, done) {
    try {
        if (!mail_address || !password)
            done(null, false, { message: 'must fill in mail_address and password' });
        userRepository.findOne({ mail_address: mail_address }).then(user => {
            if (user)
                return done(null, false, { message: 'already registered' });
            const newUser = new User_1.User();
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            newUser.mail_address = mail_address;
            newUser.password = hashedPassword;
            newUser.google_id = '';
            newUser.display_name = mail_address.split('@')[0];
            newUser.is_active = true;
            newUser.is_admin = false;
            userRepository.save(newUser).then(registered => {
                if (registered) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'signup error' });
                }
            });
        });
    }
    catch (err) {
        return done(err, false, { message: 'auth error' });
    }
}));
passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'default_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'default_secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/users/login_google_callback'
}, function (accessToken, refreshToken, profile, done) {
    let user;
    if (profile) {
        userRepository.findOne({ google_id: profile.id }).then(user => {
            if (user) {
                user.display_name = profile.displayName;
                userRepository.save(user);
            }
            else {
                user = new User_1.User();
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
    }
    else {
        return done(null, false, { message: 'auth error' });
    }
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
const app = (0, express_1.default)();
// view engine setup
app.set("views", "views");
app.set('view engine', 'pug');
//helper function in pug
app.locals.escapeHTML = userFunc_1.escapeHTML;
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("public"));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: true,
    saveUninitialized: false,
}));
app.use((0, connect_flash_1.default)());
app.use((0, helmet_1.default)({ contentSecurityPolicy: {
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
    } }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', index_1.router);
app.use("/users", users_1.router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
