const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//create sauce  
router.post('/', auth, multer, sauceCtrl.createSauce);
// update sauce
router.put('/:id', auth, sauceCtrl.modifySauce);
// delete sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// single sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Array of sauces 
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router; 