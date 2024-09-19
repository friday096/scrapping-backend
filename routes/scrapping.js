var express = require('express');
var router = express.Router();

const scrapController = require('../controller/scrapController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource scrap');
});


router.post('/scrap', scrapController.createScrap)
router.get('/scrap', scrapController.getAllScraps)
router.get('/scrap/:id', scrapController.getScrapById)
router.delete('/scrap', scrapController.deleteScrap)




module.exports = router;