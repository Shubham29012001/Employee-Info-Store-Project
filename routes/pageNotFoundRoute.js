const express = require('express');
const router = express.Router();

const { pageNotFound } = require('../controllers/pageNotFoundController')

router.route('/').all(pageNotFound);

module.exports = router;