const router = require('express').Router();
const service = require('./teams.service');

router
  .route('/')
  .get(async (req, res) => {
    return res.status(200).send(await service.findAll());
  })
  .post(async (req, res) => {
    return res.status(200).send(await service.create(req.body.name));
  });

router
  .route('/:name')
  .get(async (req, res) => {})
  .patch(async (req, res) => {})
  .delete(async (req, res) => {});

router.post('/:name/add', async (req, res) => {});

router.patch('/:name/judge', async (req, res) => {});

module.exports = router;
