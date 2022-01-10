"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure = void 0;
function ensure(req, res, next) {
    //ログインチェック
    if (req.isAuthenticated()) {
        return next();
    }
    //失敗時はログイン画面へ
    res.redirect('/users/login?from=' + req.originalUrl);
}
exports.ensure = ensure;
