const router = require('express').Router();
const service = require('./battles.service');

router
  .route('/')
  .get(async (req, res) => {})
  .post(async (req, res) => {});

router
  .route('/:id')
  .get(async (req, res) => {})
  .patch(async (req, res) => {});

router.patch('/:id/active', async (req, res) => {});

router.get('/:id/participants', async (req, res) => {});

router
  .route('/:id/leaderboard')
  .get(async (req, res) => {})
  .put(async (req, res) => {});

router
  .route('/:id/challenges')
  .get(async (req, res) => {})
  .post(async (req, res) => {});

router
  .route('/:id/challenges/:challengeId')
  .get(async (req, res) => {})
  .post(async (req, res) => {})
  .patch(async (req, res) => {});

router.post('/:id/challenges/:challengeId/submit', async (req, res) => {});

module.exports = router;
