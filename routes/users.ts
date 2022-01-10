import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

export const router = Router();

/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

router.get('/login', function(req: Request, res: Response, next: NextFunction){
  if (req.user){
    req.logout();
  }
  res.render('./users/login', { title: 'login', errorMessage: req.flash('error') });
});
//ローカルログイン
router.post('/login',
  passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })
);
//Googleログイン
router.get('/login_google',
  passport.authenticate('google',{
    scope: ['https://www.googleapis.com/auth/plus.login']
  })
);
//コールバック
router.get('/login_google_callback',
  passport.authenticate('google',{
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/logout', function(req: Request, res: Response, next: NextFunction){
  req.logout();
  res.redirect('/users/login');
});

router.get('/signup', function(req: Request, res: Response, next: NextFunction){
  res.render('./users/signup', {errorMessage: req.flash('error')});
});
//ローカルサインアップ
router.post('/signup',
  function(req: Request, res: Response, next: NextFunction){
    //パスワード再確認
    if(req.body.password != req.body.password_confirm) return res.redirect('/users/signup');
    return next();
  },
  passport.authenticate('local-signup',{
    successRedirect: '/',
    failureRedirect: '/users/signup',
    failureFlash: true
  })
);