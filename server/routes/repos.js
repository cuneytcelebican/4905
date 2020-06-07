import express from 'express';
const router = express.Router();

/**
 * GET dashboard page
 */
router.get('/', (req, res, next) => 
{
    res.render('dashboard', { title: 'dashboard' });
});

router.get('/new', (req, res, next) => 
{
    res.render('dashboard', { title: 'Create a new repository' });
});

router.get('/upload', (req, res, next) => 
{
    res.render('dashboard', { title: 'dashboard2' });
});

export default router;