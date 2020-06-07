import express from 'express';
import User from '../models/user';
import passport from 'passport';
const router = express.Router();

/**
 * GET login page
 */
router.get('/login', (req, res, next) => 
{
  console.log("email:" + req.body.email)
  res.render('login', { title: 'Login', landingPage: true });
});

/**
 * Handles login request to the application.
 */
router.post('/login', (req, res, next) =>
{
  passport.authenticate('local', { successRedirect: '/repos', failureRedirect: '/users/login', failureFlash: true})
  (req, res, next);
});

/* GET register page. */
router.get('/register', (req, res, next) =>
{
  res.render('register', { title: 'Register' });
});

/**
 * Handles post request for /users/register page.
 * Creates a user if the user entered all information
 * correctly.
 */
router.post('/register', validateRegistration, async (req, res, next) =>
{  
  try
  {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    await User.createUser(newUser);
    res.redirect('/users/login');
  }
  catch (err)
  {
    console.log(`/users/register failed, error: ${err}`);
    next(err);
  }
});

router.get('/logout', (req, res) => 
{
  req.logout();
  res.redirect('/users/login');
});

/**
 * Validates user inputs and checks if the email address
 * already registered to the system.
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
async function validateRegistration(req, res, next)
{
  req.checkBody('email', 'Full name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('passwordValidation', 'Confirm password is requierd').notEmpty();
  req.checkBody('password', 'Password and confirm password fields must match').equals(req.body.passwordValidation);
  
  let errors = req.validationErrors();

  const user = await User.find({email: req.body.email});

  if (user.length)
  {
    errors = Object.keys(errors).length
      ? Object.assign({}, errors, {duplicateEmail: {msg: 'This email address is already registered'}})
      : [{msg: 'This email address is already registered'}]
  };

  if (errors)
  {
    req.flash('error_msg', errors);
    res.redirect('/users/register')
  }
  else
  {
    next();
  }
}

export default router;