import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>
{
  res.render('index', { title: 'Home' });
});

/* GET login page. */
router.get('/about', (req, res, next) =>
{
  res.render('about', { title: 'About' });
});

/* GET login page. */
router.get('/how-it-works', (req, res, next) =>
{
  res.render('how-it-works', { title: 'How It Works' });
});


/* GET request page. */
router.get('/request', (req, res, next) =>
{
  res.render('request', { title: 'Request' });
});

export default router;
