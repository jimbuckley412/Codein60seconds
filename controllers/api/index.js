const router = require('express').Router();
const dashboardRoutes = require('./dashboardRoutes');
const explorersRoutes = require('./explorersRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/explorers', explorersRoutes);

module.exports = router;
