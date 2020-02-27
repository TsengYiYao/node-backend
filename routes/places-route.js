const express = require('express');
const { check } = require('express-validator');

const placesController = require('../controllers/places-controller');

const router = express.Router();

router.get('/users/:uid', placesController.getPlacesByUserId);

router.get('/:pid', placesController.getPlacesById);

router.post('/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ], placesController.createPlace);

router.patch('/:pid', placesController.updatePlace);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;