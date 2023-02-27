const router = require('express').Router();
const service = require('./users.service');
const authorized = require('../middlewares/authorization.middleware');

router.get('/', authorized(['admin']), async (req, res) => {
  // Récupère tous les utilisateurs
  const users = await service.findAll();
  return res.status(200).send(users);
});

router.get('/participants', async (req, res) => {
  return res.status(200).send(await service.findAllParticipants());
});

router.get('/judges', async (req, res) => {
  return res.status(200).send(await service.findAllJudges());
});

// Pour les utilisateurs
router
  .route('/me')
  .get(async (req, res) => {
    return res.status(200).send(req.user);
  })
  .patch(async (req, res) => {
    const update = await service.update(req.user, req.body);
    return res.status(200).send(update);
  })
  .delete(async (req, res) => {
    const deletedUser = await service.deleteUser(req.user.id);
    return res.status(200).send(deletedUser);
  });

router.use('/:id', authorized(['admin']));

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const user = await service.findById(req.params.id);
      return res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const updatedUser = await service.updateAsAdmin(
        { id: req.params.id },
        req.body
      );
      return res.status(200).send(updatedUser);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deletedUser = await service.deleteUser(req.params.id);
      return res.status(200).send(deletedUser);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
