const express = require('express');
const router = express.Router();
const {
  uaParser,
  checkBan,
  requireJwtAuth,
  // concurrentLimiter,
  // messageIpLimiter,
  // messageUserLimiter,
} = require('../../middleware');

const files = require('./files');
const images = require('./images');
// UCLA BEGIN EDIT
const excel = require('./excel');
// UCLA END EDIT

router.use(requireJwtAuth);
router.use(checkBan);
router.use(uaParser);

router.use('/', files);
router.use('/images', images);
// UCLA BEGIN EDIT
router.use('/excel', excel);
// UCLA END EDIT

module.exports = router;
