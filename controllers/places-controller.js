const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

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
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: 'No. 7, Section 5, Xinyi Road, Xinyi District, Taipei, Taiwan.',
    creator: 'u2'
  },
];

// Retrieve list of all places for a given user id
const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find(u => u.creator === userId);

  if (!user) {
    return next(new HttpError('Could not find a place for the provided user id.', 404));
  }

  res.json({ user });
};

// Get a specific place by place id (pid)
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place });
};

// Create a new place
const createPlace = (req, res, next) => {

  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

// Updata a place by id (pid)
const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {
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

  res.status(201).json({ place: updatedPlace });
};

// Delete a place by id
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(201).json({ places: DUMMY_PLACES });
};

exports.getPlaceByUserId = getPlaceByUserId;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;