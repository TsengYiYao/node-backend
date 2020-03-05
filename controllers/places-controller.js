const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Taipei 101',
    description: 'The world\'s tallest from its opening in 2004 until the 2010.',
    location: {
      lat: 25.033976,
      lng: 121.5645389
    },
    address: 'No. 7, Section 5, Xinyi Road, Xinyi District, Taipei, Taiwan.',
    creator: 'u2'
  },
];

// Retrieve list of all places for a given user id
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    place = await Place.find({ creator: userId });
  } catch (e) {
    return next(new HttpError(e, 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find a place for the provided user id.', 404));
  }

  res.json({ place: places.toObject({ getters: true }) });
};

// Get a specific place by place id (pid)
const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError(e, 500));
  }

  if (!place || place.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// Create a new place
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    // coordinates = await getCoordsForAddress(address);
    coordinates = { lat: 20.00092, lng: 45.9873 };
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      `Creating place failed, please try again. Err: ${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// Updata a place by id (pid)
const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const placeId = req.params.pid;
  const places = DUMMY_PLACES.filter(p => p.id === placeId);

  if (!places || places.length === 0) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }
  const { title, description, coordinates, address, creator } = req.body;

  const updatedPlace = {
    id: placeId,
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES = DUMMY_PLACES.map((place) => {
    if (place.id === placeId) {
      return updatedPlace;
    } else {
      return place;
    }
  });

  res.status(200).json({ place: updatedPlace });
};

// Delete a place by id
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ places: DUMMY_PLACES });
};

exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlacesById = getPlacesById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;