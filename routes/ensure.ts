import { Router, Request, Response, NextFunction } from "express";
export function ensure(req: Request, res: Response, next: NextFunction) {
  //ログインチェック
  if (req.isAuthenticated()) { return next(); }
  //失敗時はログイン画面へ
  res.redirect('/users/login?from=' + req.originalUrl);
}