var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('pag-inicial');
});

router.get('/sobre', function(req,res){
  res.render('pag-sobre')
});

router.get('/contato', function (req,res) {
  res.render('pag-contato')
})

module.exports = router;
