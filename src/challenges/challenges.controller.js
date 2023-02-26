const router = require('express').Router();
const service = require('./challenges.service');
const multer = require('multer');
const authorized = require('../middlewares/authorization.middleware');
const logger = require('../utils/logger');
require('dotenv/config');

const FILE_SIZE_LIMIT = 10000000; // file size limit 10mb
const MAX_ARRAY_SIZE = 3; // max number of files in array

const multerFilter = (req, file, done) => {
  console.log(file);
  done(null, true);
};
const upload = multer({ fileFilter: multerFilter });

router
  .route('/', authorized(['admin']))
  .get(async (req, res, next) => {
    try {
      return res.status(200).send(await service.getAllChallenges());
    } catch (err) {
      next(err);
    }
  })
  .post(upload.array('resources', MAX_ARRAY_SIZE), async (req, res, next) => {
    console.log(req.body, req.files);
    try {
      const challenge = await service.createOne(req.user.id, {
        ...req.body,
        resources: req.files
      });
      return res.status(200).send(challenge);
    } catch (err) {
      next(err);
    }
  });

router.route('/active').get(async (req, res, next) => {
  try {
    return res.status(200).send(await service.getActiveChallenges());
  } catch (err) {
    next(err);
  }
});

router
  .route('/:id', authorized(['admin']))
  .get(async (req, res, next) => {
    try {
      return res
        .status(200)
        .send(await service.findBySequenceId(req.params.id));
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      return res
        .status(200)
        .send(await service.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  })
  .put(upload.array('resources', MAX_ARRAY_SIZE), async (req, res, next) => {
    try {
      return res.status(200).send(
        await service.update(req.params.id, {
          ...req.body,
          resources: req.files
        })
      );
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      return res.status(200).send(await service.deleteOne(req.params.id));
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
