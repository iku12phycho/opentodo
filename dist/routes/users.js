"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
exports.router = (0, express_1.Router)();
/* GET users listing. */
exports.router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
exports.router.get('/login', function (req, res, next) {
    if (req.user) {
        req.logout();
    }
    res.render('./users/login', { title: 'login', errorMessage: req.flash('error') });
});
//ローカルログイン
exports.router.post('/login', passport_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));
//Googleログイン
exports.router.get('/login_google', passport_1.default.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
}));
//コールバック
exports.router.get('/login_google_callback', passport_1.default.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));
exports.router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/users/login');
});
exports.router.get('/signup', function (req, res, next) {
    res.render('./users/signup', { errorMessage: req.flash('error') });
});
//ローカルサインアップ
exports.router.post('/signup', function (req, res, next) {
    //パスワード再確認
    if (req.body.password != req.body.password_confirm)
        return res.redirect('/users/signup');
    return next();
}, passport_1.default.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/users/signup',
    failureFlash: true
}));
